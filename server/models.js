const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('teacher', 'student'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacher_code: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const Assignment = sequelize.define('Assignment', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  due_date: { type: DataTypes.DATE },
  created_by: { type: DataTypes.INTEGER } // Teacher ID
});

const Submission = sequelize.define('Submission', {
  content: { type: DataTypes.TEXT },
  grade: { type: DataTypes.STRING }, // e.g. "95/100" or just "95"
  status: { type: DataTypes.ENUM('submitted', 'graded'), defaultValue: 'submitted' }
});

const Test = sequelize.define('Test', {
  title: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING }, // Optional password to start test
  created_by: { type: DataTypes.INTEGER }
});

const Question = sequelize.define('Question', {
  question_text: { type: DataTypes.TEXT, allowNull: false },
  options: { type: DataTypes.JSON }, // JSON array of strings
  correct_answer: { type: DataTypes.STRING }
});

const TestResult = sequelize.define('TestResult', {
  score: { type: DataTypes.INTEGER },
  total: { type: DataTypes.INTEGER }
});

const Attendance = sequelize.define('Attendance', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('present', 'absent', 'tardy'), allowNull: false }
});

const Grade = sequelize.define('Grade', {
  subject: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.STRING, allowNull: false } // "A", "95", etc.
});

// Relationships
User.hasMany(Assignment, { foreignKey: 'created_by' });
Assignment.belongsTo(User, { foreignKey: 'created_by' });

User.hasMany(Submission, { foreignKey: 'student_id' });
Submission.belongsTo(User, { foreignKey: 'student_id' });

Assignment.hasMany(Submission, { foreignKey: 'assignment_id' });
Submission.belongsTo(Assignment, { foreignKey: 'assignment_id' });

User.hasMany(Test, { foreignKey: 'created_by' });
Test.belongsTo(User, { foreignKey: 'created_by' });

Test.hasMany(Question, { foreignKey: 'test_id', onDelete: 'CASCADE' });
Question.belongsTo(Test, { foreignKey: 'test_id' });

User.hasMany(TestResult, { foreignKey: 'student_id' });
TestResult.belongsTo(User, { foreignKey: 'student_id' });

Test.hasMany(TestResult, { foreignKey: 'test_id' });
TestResult.belongsTo(Test, { foreignKey: 'test_id' });

User.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(User, { foreignKey: 'student_id' });

User.hasMany(Grade, { foreignKey: 'student_id' });
Grade.belongsTo(User, { foreignKey: 'student_id' });

module.exports = {
  sequelize,
  User,
  Assignment,
  Submission,
  Test,
  Question,
  TestResult,
  Attendance,
  Grade
};
