const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

// const userRoutes = require('./api/routes/users');

mongoose.connect(
  `${config.databaseUrl}/${config.databaseName}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.Promise = global.Promise;
mongoose.connection.once('open', _ => { console.log('Database connected') });
mongoose.connection.on('error', err => { console.error('connection error:', err) });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, PATCH, POST, DELETE');
    return res.status(200).json({});
  }
  next();
});

// app.use('/auth', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
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
