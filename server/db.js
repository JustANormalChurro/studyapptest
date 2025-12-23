const { Sequelize } = require('sequelize');
const path = require('path');

const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const dbPath = isVercel ? '/tmp/database.sqlite' : path.join(__dirname, 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

module.exports = sequelize;
