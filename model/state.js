'use strict';

const db = require('./db');
const Sequelize = require('sequelize');
const Promise = require('bluebird');
const debug = require('debug')('air:model:state');
const _ = require('lodash');
const moment = require('moment');
const cal = require('../helper/cal');

const State = db.define('state', {
  temperature: Sequelize.FLOAT,
  speed: Sequelize.INTEGER,
  mode: Sequelize.ENUM('off', 'dry', 'purge'),
  currentTemperature: Sequelize.FLOAT,
  money: Sequelize.FLOAT,
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
      if (this.temperature < 16 || this.temperature > 36) {
        throw new Error('温度设定不合法');
      }
    },

    isSameWithLast: Promise.coroutine(function *() {
      const states = yield State.findAll({ where: { userId: this.userId } });
      const lastState = _.last(states);
      if (!lastState) {
        if (this.speed !== 0) {
          return;
        }
        throw new Error('没有开空调, 无法设置');
      }
      if (lastState.temperature === this.temperature &&
          lastState.speed === this.speed &&
          lastState.mode === this.mode) {
        throw new Error('参数设定与上次一样!');
      }
    })
  },
  hooks: {
    beforeCreate: Promise.coroutine(function *(state) {
      const states = yield State.findAll({ where: { userId: state.userId } });
      const lastState = _.last(states);
      if (!lastState) {
        state.currentTemperature = 35;
        return;
      }
      const duration = moment(state.timestamp).diff(moment(lastState.timestamp), 'seconds');
      const result = cal(duration, lastState.speed, lastState.temperature, lastState.currentTemperature);
      debug(result);
      state.currentTemperature = result.currentTemperature;
      state.money = result.bill;
    })
  }
});

module.exports = State;
