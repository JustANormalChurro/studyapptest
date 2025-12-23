const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

const seedData = async () => {
  await sequelize.sync({ force: true });

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

  console.log('Database seeded!');
  process.exit();
};

seedData();
