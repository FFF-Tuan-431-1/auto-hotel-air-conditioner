var Sequelize = require('sequelize');

var db = new Sequelize('web_manager', 'root', null, {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

module.exports = db;