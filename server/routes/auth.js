const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.route('/api/auth/signin')
    .post(authController.signin);

router.route('/api/auth/signout')
    .get(authController.requireSignin, authController.signout);

module.exports = router;