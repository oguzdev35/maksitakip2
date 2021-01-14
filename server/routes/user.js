const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.route('/api/user')
    .get(userController.create);

module.exports = router;