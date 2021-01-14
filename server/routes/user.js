const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.route('/api/user')
    .post(userController.checkUserProps('create'), userController.create);

module.exports = router;