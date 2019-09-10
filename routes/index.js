var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/login', function(req, res, next) {
  User.login(req.body, function(response){
    res.send(response);
  });
});

module.exports = router;
