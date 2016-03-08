var express = require('express');
var router = express.Router();
var User = require('../models/user');
var debug = require('debug')('wm:controller:users');

/* POST /api/user create a user */
router.post('/', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({error: '用户名或者密码不能为空'});
  }

  User.create({username: username, password: password}).then(user => {
    res.sendStatus(200);
  }).catch(err => {
    // 发生错误一般都是用户名重复了
    res.status(400).json({error: '该用户名已被使用'});
  })
});

module.exports = router;