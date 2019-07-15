var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/logins', function(req, res, next) {
  res.render('index', { title: 'Express bb' });
});

module.exports = router;
