const User = require('../model/user');

module.exports = function * (next) {
  if (this.session.userId) {
    const user = yield User.findById(this.session.userId);
    if (user) {
      this.user = user;
    }
  }

  yield next;
};
