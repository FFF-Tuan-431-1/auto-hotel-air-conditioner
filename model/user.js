const db = require('./db');
const Sequelize = require('sequelize');
const Promise = require('bluebird');
const debug = require('debug')('air:model:user');
const moment = require('moment');

const calBill = require('../helper/calBill');

const State = require('./state');

const User = db.define('user', {
  password: Sequelize.STRING,
  roomId: Sequelize.INTEGER, // if room is 888, then it's a admin account
  name: Sequelize.STRING,
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  classMethods: {
    createUser({ roomId, name }) {
      const password = Math.random().toString(10).split('.')[1].substr(0, 4);
      return User.create({
        password,
        roomId,
        name
      })
    }
  },
  validate: {
    hasSameUser: Promise.coroutine(function *(){
      const oneUser = yield User.find( { where: { name: this.name, active: true} });
      debug(oneUser);
      if (oneUser) {
        throw new Error('Same user exists!');
      }
    })
  },
  instanceMethods: {
    getBill: Promise.coroutine(function *() {
      const states = yield this.getStates();
      const slots = [];
      states.reduce((prev, next) => {
        slots.push([prev, next]);
        return next;
      });
      return slots.reduce((result, statePair) => {
        const [ prevState, nextState ] = statePair;
        const prevTime = moment(prevState.timestamp);
        const nextTime = moment(nextState.timestamp);
        const duration = nextTime.diff(prevTime, 'seconds');
        const money = calBill({
          duration,
          temperature: prevState.temperature,
          speed: prevState.speed,
          mode: prevState.mode
        });
        result.push({
          temperature: prevState.temperature,
          speed: prevState.speed,
          mode: prevState.mode,
          money,
          startTime: prevTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: nextTime.format('YYYY-MM-DD HH:mm:ss')
        });
        return result;
      }, [])
    })
  }
});

User.hasMany(State, {as: 'states'});

User.sync().then(() => {
  debug('User sync success');
});

State.sync().then(() => {
  debug('State sync success');
});

module.exports = User;
