var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var Client = require('../models/client').Client;

/* GET home page. */
router.get('/', function(req, res) {
  if (req.user) {
    return res.redirect('/home');
  }
  res.render('index', { title: '网络管理系统' });
});

router.get('/home' ,(req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('home', {user: req.user});
});

router.get('/client/:id', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  var clientId = req.params.id;

  Client.findOne({where: {id: clientId}})
    .then(function(client) {
      if (!client) {
        return Promise.reject(null);
      }
      return Promise.all([Promise.resolve(client), client.getStates()]);
    }).then(function(data){
      res.render('client', {client: data[0], states: data[1], moment: require('moment')});
    });
});



router.get('/logout', middleware.needLogin, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});



module.exports = router;
