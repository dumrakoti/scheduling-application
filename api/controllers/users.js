const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const config = require('./../config');

const User = require('./../models/user');
const tokenList = {}

exports.users_register = (req, res, next) => {
  const rb = req && req.body;
  if (rb.email && rb.name && rb.password) {
    User.find({ email: rb.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(422).json({ status: 422, error: 'Email already exists' });
        } else {
          bcrypt.hash(rb.password, 10, (error, hash) => {
            if (error) {
              return res.status(500).json({ status: 500, error: error });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: rb.email,
                name: rb.name,
                password: hash,
                created_at: new Date()
              });
              user.save()
                .then(result => {
                  res.status(201).json({
                    status: 201,
                    message: 'User register successfully.',
                    data: { email: result.email, name: result.name, _id: result._id }
                  });
                })
                .catch(error => {
                  res.status(500).json({ status: 500, error: error || 'Cannot register at this time.' });
                });
            }
          })
        }
      });
  } else {
    let error = {};
    let errors = [];
    if (rb.name === '') {
      errors.push('Full name required.');
      error.name = 'Full name required.';
    }
    if (rb.email === '') {
      errors.push('Email required.');
      error.email = 'Email required.';
    }
    if (rb.password === '') {
      error.password = 'Password required.';
      errors.push('Password required.');
    }
    return res.status(422).json({ status: 422, error, errors });
  }
}

exports.users_login = (req, res, next) => {
  const rb = req && req.body;
  if (rb.email && rb.password) {
    User.find({ email: rb.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({ status: 401, error: "User not found." });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({ message: "Login failed" });
          }
          if (result) {
            const userData = { email: user[0].email };
            const token = jwt.sign(userData, config.secret, { expiresIn: config.tokenLife })
            const refreshToken = jwt.sign(userData, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife })
            const tokenData = {
              refresh_token: refreshToken,
              access_token: token,
              token_type: config.tokenType
            };
            tokenList[user[0].email] = tokenData;
            return res.status(200).json({
              status: 200,
              message: "Login successful",
              userData: { ...tokenData, email: user[0].email, id: user[0]._id, name: user[0].name }
            });
          }
          res.status(401).json({ status: 401, error: "Username / password incorrect." });
        });
      })
      .catch(err => {
        res.status(500).json({ status: 500, error: err || 'Internal server error' });
      });
  } else {
    let error = {};
    let errors = [];
    if (rb.email === '') {
      errors.push('Email required.');
      error.email = 'Email required.';
    }
    if (rb.password === '') {
      error.password = 'Password required.';
      errors.push('Password required.');
    }
    return res.status(422).json({ status: 422, error, errors });
  }
}

exports.users_token = (req, res, next) => {
  const reqData = req.body
  console.log(reqData);
  if ((reqData.email) && (reqData.email in tokenList)) {
    const user = { "email": reqData.email }
    const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife });
    const tokenData = { "token": token }
    tokenList[reqData.email].access_token = token
    return res.status(200).json({ status: 200, data: tokenData, });
  } else {
    delete tokenList[reqData.email];
    return res.status(401).json({ status: 401, error: "token expired" });
  }
}

exports.users_logout = (req, res, next) => {
  res.status(200).json({ status: 200, message: 'Logout Success' });
}

exports.users_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({ status: 200, message: "User deleted" });
    })
    .catch(err => {
      res.status(500).json({ status: 500, error: err });
    });
}

exports.user_get = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select('name email _id created_at')
    .exec()
    .then(user => {
      if (user) {
        res.status(200).json({ status: 200, data: user });
      } else {
        res.status(404).json({ status: 404, error: 'Invalid user.' });
      }
    }).
    catch(error => {
      res.status(500).json({ status: 500, error: error || 'Internal Server Error' });
    });
}

exports.user_patch = (req, res, next) => {
  const _id = req.params.userId;
  const updateOps = {
    name: req.body.title,
    updated_at: new Date()
  };
  User.updateOne({ _id }, { $set: updateOps })
    .select('name _id email create_at updated_at')
    .exec()
    .then(result => {
      res.status(200).json({ status: 200, message: 'User updated.', data: result });
    })
    .catch(error => {
      res.status(500).json({ status: 500, error: error || 'Internal Server Error' });
    });
}