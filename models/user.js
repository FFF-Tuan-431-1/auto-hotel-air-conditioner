var db = require('./db');
var Sequelize = require('sequelize');
var debug = require('debug')('wm:model:user');
var User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  }
});

User.sync().then(() => {
  debug('User sync success');
});

module.exports = User;