var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbTool = require("./public/dbTool/dbTool");

var indexRouter = require('./routes/index');
var users = require('./routes/users');
var navMenu = require('./routes/navMenu');

var app = express();
//解决头信息跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//connect db
dbTool.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', users);
app.use('/navMenu', navMenu);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3888); // 设定监听端口
 
//启动监听
var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
});

// module.exports = app;
