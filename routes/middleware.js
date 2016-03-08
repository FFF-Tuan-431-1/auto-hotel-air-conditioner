var User = require('../models/user');

// 这个中间件是验证登录的中间件
// 加载之后,如果登录了,会把 user 对象绑定到 req 上
var needLogin = function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({error: '未登录'});
  }
  next();
};

var bindUser = function(req, res, next) {
  if (!req.session.userId) {
    return next();
  }
  User.findOne({where: {id: req.session.userId}}).then((user) => {
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  });
};

module.exports = {
  needLogin,
  bindUser
};