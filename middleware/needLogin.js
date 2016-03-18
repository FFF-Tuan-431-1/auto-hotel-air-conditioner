module.exports = function *(next) {
  if (!this.user) {
    this.response.status = 401;
  } else {
    yield next;
  }
};
