const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.route('/api/admin')
    .post(userController.checkUserProps('create'), userController.asAdmin, userController.create);

module.exports = router;