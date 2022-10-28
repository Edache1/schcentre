var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const fileupload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const categoryRouter = require('./routes/category');
const educationRouter = require('./routes/education');
const sectionRouter = require('./routes/sections');
const intervalRouter = require('./routes/interval');
const sessintRouter = require('./routes/sessint');
const edusessRouter = require('./routes/edusess');

const app = express();
app.use(express.json());


app.use(fileupload());
// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, 'views/templates/layout'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/education', educationRouter);
app.use('/sections', sectionRouter);
app.use('/interval', intervalRouter);
app.use('/sessint', sessintRouter);
app.use('/edusess', edusessRouter);

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

module.exports = app;
