var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

router.use('/', require('./session'));
router.use('/user', require('./user'));
router.use('/client', middleware.needLogin, require('./client'));

module.exports = router;
