const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

const router = express.Router();

router.route('/api/user')
    .post(authController.requireSignin, userController.create);

module.exports = router;