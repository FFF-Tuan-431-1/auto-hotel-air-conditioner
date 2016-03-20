module.exports = function *(next) {
  if (this.user && this.user.roomId === 888) {
    yield next;
  } else {
    this.response.status = 400;
   }
};
