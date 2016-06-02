const Router = require('koa-router');
const router = new Router();

const userRouter = require('./user');
const sessionRouter = require('./session');
const settingsRouter = require('./settings');
const billRouter = require('./bill');
const pageRouter = require('./page');
const tempRouter = require('./temperature');

const sessionMiddleware = require('../middleware/session');

router.use(sessionMiddleware);

router.use('/api', sessionRouter.routes());
router.use('/api', billRouter.routes());
router.use('/api', tempRouter.routes());
router.use('/api/user', userRouter.routes());
router.use('/api/settings', settingsRouter.routes());

module.exports = router;
