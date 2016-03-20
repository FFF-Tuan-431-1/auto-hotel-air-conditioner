const Router = require('koa-router');
const router = new Router();

module.exports = router;

router.get('/', function *() {
  yield this.render('index', {
    user: this.user
  });
});
