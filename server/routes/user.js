const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

const router = express.Router();

router.route('/api/user')
    .post(authController.requireSignin, userController.create);

router.route('/api/users')
    .get(authController.requireSignin, userController.list);

router.route('/api/user/:userId')
    .get(authController.requireSignin, authController.hasAuthorization, userController.view);

router.param('userId', userController.findById);

module.exports = router;