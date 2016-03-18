'use strict';

const db = require('./db');
const Sequelize = require('sequelize');
const Promise = require('bluebird');
const debug = require('debug')('air:model:state');
const _ = require('lodash');

const State = db.define('state', {
  temperature: Sequelize.FLOAT,
  speed: Sequelize.INTEGER,
  mode: Sequelize.ENUM('off', 'dry', 'purge'),
  timestamp: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  validate: {
    isSpeedValid() {
      if (this.speed < 0 || this.speed > 5) {
        throw new Error('风速设定不合法');
      }
    },

    isTemperatureValid() {
      if (this.temperature < 16 || this.temperature > 30) {
        throw new Error('温度设定不合法');
      }
    },

    isSameWithLast: Promise.coroutine(function *() {
      const states = yield State.findAll({ where: { userId: this.userId } });
      const lastState = _.last(states);
      if (!lastState) {
        return;
      }
      if (lastState.temperature === this.temperature &&
          lastState.speed === this.speed &&
          lastState.mode === this.mode) {
        throw new Error('参数设定与上次一样!');
      }
    })
  }
});

module.exports = State;
