'use strict';

const Router = require('koa-router');
const router = new Router();
const _ = require('lodash');

module.exports = router;

const debug = require('debug')('air:api:bill');

router.get('currentBill', function *() {
  const slots = yield this.user.getBill();
  this.response.body = {
    room: this.user.roomId,
    name: this.user.name,
    totalMoney: slots.reduce((result, next) => result + next.money, 0),
    slots
  }
});

router.get('checkout', function *() {
  this.user.active = false;
  yield this.user.save();
  this.session = null;
});
