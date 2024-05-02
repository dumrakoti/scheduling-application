const express = require('express');
var path = require('path');
const morgan = require('morgan');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
var createError = require('http-errors');
var cors = require('cors')
var cookieParser = require('cookie-parser');
const config = require('./config');
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const connectDB = require('./config/db');

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const utilsRoutes = require('./routes/utils');
const eventRoutes = require('./routes/event');

const app = express();

connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: config.secret || process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  // origin: '*',
  origin: config.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/', indexRoutes);
app.use('/auth', userRoutes);
app.use('/utils', utilsRoutes);
app.use('/event', eventRoutes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal server error'
    }
  });
});

module.exports = app;
