const Router = require('koa-router');
const router = new Router();

module.exports = router;

const debug = require('debug')('air:api:user');
const User = require('../model/user');

router.post('/', function *() {
  const { name, roomId } = this.request.body;
  try {
    const user = yield User.createUser({ name, roomId });
    this.response.body = {password: user.password, name, roomId};
  } catch (e) {
    debug(e);
    this.response.status = 400;
    this.response.body = {
      error: '已经创建过这个用户!'
    }
  }
});
