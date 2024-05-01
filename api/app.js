const express = require('express');
var path = require('path');
const morgan = require('morgan');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
var createError = require('http-errors');
var cors = require('cors')
// var cookieParser = require('cookie-parser');
const config = require('./config');

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const utilsRoutes = require('./routes/utils');
const eventRoutes = require('./routes/event');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

mongoose.connect(
  `${config.databaseUrl}/${config.databaseName}`,
  {
    useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000,
    bufferCommands: false
  }
).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
mongoose.Promise = global.Promise;
mongoose.connection.once('open', _ => { console.log('Database connected') });
mongoose.connection.on('error', err => { console.error('connection error:', err) });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyPaser.urlencoded({ extended: false }));
// app.use(bodyPaser.json());

app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE');
    return res.status(200).json({});
  }
  next();
});


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
