var db = require('./db');
var Sequelize = require('sequelize');
var debug = require('debug')('wm:model:client');

/*
 * name 主机的名字, 需要默认生成一个随机的名字
 * mac 主机的 mac 地址
 */
var Client = db.define('client', {
  room_number: {
    type: Sequelize.STRING,
    unique: true
  },

  isOnline: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

var State = db.define('state', {
  temperature: {
    type: Sequelize.STRING
  },
  start_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  last_time: {

  },
  speed: {
    type: Sequelize.STRING
  },
  energy: {
    type: Sequelize.STRING
  },
  money: {
    type: Sequelize.STRING,
    defaultValue:'0'
  }

});

Client.hasMany(State, {as: 'states'});

Client.sync().then(() => {
  debug('Client sync success');
});
State.sync().then(() => {
  debug('State sync success');
});

module.exports = {
  Client, State
};