var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbTool = require("./public/dbTool/dbTool");

var indexRouter = require('./routes/index');
var user = require('./routes/user');
var navMenu = require('./routes/navMenu');
var upload = require('./routes/common/upload');

var app = express();
//解决头信息跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// 设置跨域 详细
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('X-Powered-By', ' 3.2.1');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   if (req.method === 'OPTIONS') {
//       res.sendStatus(200);
//   } else {
//       next();
//   }
// });

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

//图片上传文件静态资源访问
app.use("/fileList",express.static(path.resolve(__dirname,"/fileList/wecansysServer")));//与文件上传的路径一直 再upload中设置

app.use('/', indexRouter);
app.use('/user', user);
app.use('/navMenu', navMenu);
app.use('/upload', upload);

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
