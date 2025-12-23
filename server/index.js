const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, Assignment, Submission, Test, Question, TestResult, Attendance, Grade } = require('./models');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'testisd_super_secret_key_2000s';

app.use(cors());
app.use(express.json());

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

const authorizeTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Teachers only' });
  next();
};

// --- AUTHENTICATION ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password, teacher_code } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

  // If teacher, check code
  if (user.role === 'teacher') {
    if (user.teacher_code !== teacher_code) {
      return res.status(401).json({ error: 'Invalid teacher code' });
    }
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

// --- ADMIN / USERS ---
app.get('/api/users/students', authenticate, authorizeTeacher, async (req, res) => {
  const students = await User.findAll({ where: { role: 'student' } });
  res.json(students);
});

app.post('/api/users/students', authenticate, authorizeTeacher, async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const student = await User.create({ name, email, password: hashedPassword, role: 'student' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- FLASH (ASSIGNMENTS) ---
app.get('/api/flash/assignments', authenticate, async (req, res) => {
  const assignments = await Assignment.findAll({ include: User });
  res.json(assignments);
});

app.post('/api/flash/assignments', authenticate, authorizeTeacher, async (req, res) => {
  const { title, description, due_date } = req.body;
  const assignment = await Assignment.create({
    title, description, due_date, created_by: req.user.id
  });
  res.json(assignment);
});

app.put('/api/flash/assignments/:id', authenticate, authorizeTeacher, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;
  await Assignment.update({ title, description, due_date }, { where: { id } });
  res.json({ success: true });
});

app.delete('/api/flash/assignments/:id', authenticate, authorizeTeacher, async (req, res) => {
  const { id } = req.params;
  await Assignment.destroy({ where: { id } });
  res.json({ success: true });
});

app.post('/api/flash/submissions', authenticate, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });
  const { assignment_id, content } = req.body;
  // Check if exists
  const existing = await Submission.findOne({ where: { assignment_id, student_id: req.user.id } });
  if (existing) {
    existing.content = content;
    await existing.save();
    return res.json(existing);
  }
  const submission = await Submission.create({
    assignment_id, student_id: req.user.id, content
  });
  res.json(submission);
});

app.get('/api/flash/submissions/:assignment_id', authenticate, authorizeTeacher, async (req, res) => {
  const submissions = await Submission.findAll({
    where: { assignment_id: req.params.assignment_id },
    include: [User]
  });
  res.json(submissions);
});

// --- RINGDOOR (TESTS) ---
app.get('/api/ringdoor/tests', authenticate, async (req, res) => {
  const tests = await Test.findAll();
  res.json(tests);
});

app.get('/api/ringdoor/tests/:id', authenticate, async (req, res) => {
  const test = await Test.findByPk(req.params.id, {
    include: [Question]
  });
  res.json(test);
});

app.post('/api/ringdoor/tests', authenticate, authorizeTeacher, async (req, res) => {
  const { title, password, questions } = req.body;
  const test = await Test.create({ title, password, created_by: req.user.id });
  for (const q of questions) {
    await Question.create({
      test_id: test.id,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer
    });
  }
  res.json(test);
});

app.post('/api/ringdoor/submit', authenticate, async (req, res) => {
  // Simple scoring logic for now
  const { test_id, answers } = req.body; // answers: { question_id: answer }
  const questions = await Question.findAll({ where: { test_id } });
  let score = 0;

  questions.forEach(q => {
    if (answers[q.id] === q.correct_answer) {
      score++;
    }
  });

  const total = questions.length;
  await TestResult.create({
    test_id,
    student_id: req.user.id,
    score,
    total
  });

  res.json({ score, total });
});

// --- AURA (ATTENDANCE & GRADES) ---
app.get('/api/aura/attendance', authenticate, async (req, res) => {
  const where = {};
  if (req.user.role === 'student') where.student_id = req.user.id;

  const records = await Attendance.findAll({ where, include: User });
  res.json(records);
});

app.post('/api/aura/attendance', authenticate, authorizeTeacher, async (req, res) => {
  const { student_id, date, status } = req.body;
  const record = await Attendance.create({ student_id, date, status });
  res.json(record);
});

app.get('/api/aura/grades', authenticate, async (req, res) => {
  const where = {};
  if (req.user.role === 'student') where.student_id = req.user.id;

  const grades = await Grade.findAll({ where, include: User });
  res.json(grades);
});

app.post('/api/aura/grades', authenticate, authorizeTeacher, async (req, res) => {
  const { student_id, subject, score } = req.body;
  const grade = await Grade.create({ student_id, subject, score });
  res.json(grade);
});


// --- ADMIN DB VIEWER ---
app.get('/api/admin/db/:table', authenticate, authorizeTeacher, async (req, res) => {
  const table = req.params.table;
  try {
    const data = await sequelize.models[table].findAll();
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Table not found' });
  }
});

app.get('/api/admin/tables', authenticate, authorizeTeacher, async (req, res) => {
    const tables = Object.keys(sequelize.models);
    res.json(tables);
});

// Serve Frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const seedIfEmpty = async () => {
  try {
    const count = await User.count();
    if (count === 0) {
      console.log('Database empty, seeding...');
      const bcrypt = require('bcrypt');

      const teachers = [
        { email: 'admin1@testisd.edu', pswd: 'generic12', code: 'E3L0a5', name: 'Teacher 1' },
        { email: 'admin2@testisd.edu', pswd: 'gen16', code: 'F20b4', name: 'Teacher 2' },
        { email: 'admin3@testisd.edu', pswd: 'generic126', code: 'S20u8k', name: 'Teacher 3' },
      ];

      for (const t of teachers) {
        const hashedPassword = await bcrypt.hash(t.pswd, 10);
        await User.create({
          email: t.email,
          password: hashedPassword,
          role: 'teacher',
          name: t.name,
          teacher_code: t.code
        });
      }

      const studentPassword = await bcrypt.hash('password123', 10);
      await User.create({
        email: 'john.doe@testisd.edu',
        password: studentPassword,
        role: 'student',
        name: 'John Doe'
      });
      console.log('Seeding complete.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  }
};

sequelize.sync().then(async () => {
  await seedIfEmpty();
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});

module.exports = app;
