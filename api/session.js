const Router = require('koa-router');
const router = new Router();

module.exports = router;

const debug = require('debug')('air:api:session');
const User = require('../model/user');

router.post('/login', function *() {
  const { password } = this.request.body;
  const user = yield User.find( { where: { password } });
  if (user) {
    this.session.userId = user.id;
    this.response.status = 200;
    this.response.body = {
      name: user.name,
      room: user.roomId
    }
  } else {
    this.response.status = 400;
    this.response.body = {
      error: '没有找到对应的密码'
    }
  }
});

router.get('/logout', function *() {
  if (!this.user) {
    this.response.status = 400;
    this.response.body = {
      error: '还没有登录'
    }
  } else {
    this.session = null;
    this.response.body = {
      msg: `退出登录成功 - ${this.user.name }`
    };
  }
});
