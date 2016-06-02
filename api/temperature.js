const Router = require('koa-router');
const router = new Router();
const moment = require('moment');
const _ = require('lodash');
const cal = require('../helper/cal');

module.exports = router;

const debug = require('debug')('air:api:temperature');
const needLoginMiddleware = require('../middleware/needLogin');
router.use(needLoginMiddleware);

router.get('/temperature', function *() {
  const states = yield this.user.getStates();
  if (states.length === 0) {
    this.response.body = {
      temperature: 35
    };
    return;
  }
  const lastState = _.last(states);
  const duration = moment().diff(moment(lastState.timestamp), 'seconds');
  this.response.body = {
    temperature:
      cal(duration, lastState.speed, lastState.temperature, lastState.currentTemperature)
        .currentTemperature
  };
});
