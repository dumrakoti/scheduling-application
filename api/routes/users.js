const express = require('express');
const router = express.Router();

const UsersController = require('./../controllers/users');
const CheckAuth = require('../middleware/check-auth');

router.post('/register', UsersController.users_register);

router.post("/login", UsersController.users_login);

router.post('/token', UsersController.users_token);

router.get('/logout', CheckAuth, UsersController.users_logout);

router.get("/:userId", CheckAuth, UsersController.user_get);

router.patch("/:userId", CheckAuth, UsersController.user_patch);

router.delete("/:userId", CheckAuth, UsersController.users_delete);

module.exports = router;