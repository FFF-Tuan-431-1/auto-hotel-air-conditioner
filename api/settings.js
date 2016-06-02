'use strict';

const Router = require('koa-router');
const router = new Router();
const _ = require('lodash');

module.exports = router;

const debug = require('debug')('air:api:settings');
const needLoginMiddleware = require('../middleware/needLogin');

router.use(needLoginMiddleware);

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
  speed = !_.isUndefined(speed) ? speed : lastState.speed;
  mode = mode ? mode : lastState.mode;
  try {
    yield this.user.createState({ temperature, speed, mode });
    this.response.body = { temperature, speed, mode };
  } catch (e) {
    this.response.status = 400;
    this.response.body = {
      error: e.errors[0].message
    };
  }
});

router.get('/', function *() {
  const states = yield this.user.getStates();
  // if there is no states ?
  this.response.body = _.last(states);
});
