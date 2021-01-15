const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.route('/api/admin')
    .post(adminController.checkForAdminExistence, adminController.create);

module.exports = router;