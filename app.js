const koa = require('koa');
const hbs = require('koa-hbs');
const koaBody = require('koa-body');
const session = require('koa-session');

const app = koa();
const router = require('./api');

app.use(hbs.middleware({
  viewPath: __dirname + '/views',
  layoutsPath: __dirname + '/views',
  defaultLayout: 'default'
}));

app.keys = ['this is the cookie secret'];
app.use(session(app));
app.use(koaBody());

app.use(router.routes(), router.allowedMethods());

app.use(function *() {
  yield this.render('index', {
    title: 'Hello, world!'
  })
});


app.listen(3000);
