var express = require('express');
var router = express.Router();
var User = require('../models/user');
var middleware = require('./middleware');

/* POST /api/login 登录的接口 */
router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    if (!user || user.password !== password) {
      return res.status(400).json({error: '用户名或密码错误'});
    }

    req.session.userId = user.id;
    res.sendStatus(200);
  });
});

/* GET /api/logout 登出的接口 */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.sendStatus(200);
  });
});


// 测试登录的接口
router.get('/test', middleware.needLogin, function(req, res) {
  var userId = req.session.userId;
  res.status(200).send('your username is ' + req.user.username);
});

module.exports = router;
