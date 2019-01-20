var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var cors = require('cors');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var {uploadFile } = require('./utils/aws');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors())
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload',  async (req, res, next) => {
  let requestFile = req.files.file
  const fileName = req.files.file.name;
  const type = req.files.file.mimetype;
  console.log(type);
  await requestFile.mv(
    `${__dirname}/utils/${fileName}`)
;
  let response = {"file": "lehsun"};
  response = await uploadFile(req.files.file.name, type);
    // res.send(JSON.stringify(response));
    res.json(response);

})

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

const handleUpload = 
module.exports = app;
