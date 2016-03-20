const koa = require('koa');
const hbs = require('koa-hbs');
const koaBody = require('koa-body');
const session = require('koa-session');

const debug = require('debug')('air:app');
const app = koa();
const router = require('./api');
const pageRouter = require('./api/page');

app.use(hbs.middleware({
  viewPath: __dirname + '/views',
  layoutsPath: __dirname + '/views',
  defaultLayout: 'default',
  disableCache: true
}));

app.keys = ['this is the cookie secret'];
app.use(session(app));
app.use(koaBody());

app.use(function *(next) {
  debug(this.request.path);
  yield next;
});

app.use(require('koa-static')(__dirname + '/public'));
app.use(router.routes(), router.allowedMethods());
app.use(pageRouter.routes(), router.allowedMethods());

app.listen(3000);
