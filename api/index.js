const Router = require('koa-router');
const router = new Router();

const userRouter = require('./user');
const sessionRouter = require('./session');
const settingsRouter = require('./settings');
const billRouter = require('./bill');

const sessionMiddleware = require('../middleware/session');
const needLoginMiddleware = require('../middleware/needLogin');

router.use(sessionMiddleware);

router.use('/', sessionRouter.routes());
router.use('/user', userRouter.routes());
router.use('/settings', needLoginMiddleware, settingsRouter.routes());
router.use('/', billRouter.routes());

module.exports = router;
