const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// helper functions
const utils = require('./lib/utils');

// db
const knex = require('./db/connection');

// db session storage
const store = new KnexSessionStore({knex})

// routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const cart = require('./routes/cart');
const admin = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'go-chu-session',
  secret: 'secretsecret',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 },
  store: store
}));

app.use(utils.getSession);

app.use('/', index);
app.use('/auth', auth);
app.use('/cart', cart);
app.use('/admin', utils.requiresLogin, admin);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;