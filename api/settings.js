'use strict';

const Router = require('koa-router');
const router = new Router();
const _ = require('lodash');

module.exports = router;

const debug = require('debug')('air:api:settings');

router.post('/', function *() {
  const states = yield this.user.getStates();
  let lastState = _.last(states);
  if (!lastState) {
    lastState = {
      temperature: 26,
      speed: 0,
      mode: 'off'
    };
  }
  let { temperature, speed, mode } = this.request.body;
  temperature = temperature ? temperature : lastState.temperature;
  speed = speed ? speed : lastState.speed;
  mode = mode ? mode : lastState.mode;
  try {
    yield this.user.createState({ temperature, speed, mode });
    this.response.body = { temperature, speed, mode };
  } catch (e) {
    debug(e);
    this.response.status = 400;
    this.response.body = e;
  }
});

router.get('/', function *() {
  const states = yield this.user.getStates();
  // if there is no states ?
  this.response.body = _.last(states);
});
