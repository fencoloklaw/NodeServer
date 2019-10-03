var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dotenv = require('dotenv');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var db;
var app = express();
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-jxbyu.mongodb.net/admin?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

client.connect(err => {
  assert.equal(null, err);
  console.log('Connected successfully to server');
  db = client.db
});

module.exports = app;
