const Sequelize = require('sequelize');

const db = new Sequelize('air_manager', 'root', null, {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

module.exports = db;
