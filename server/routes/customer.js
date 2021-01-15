const express = require('express');
const authCtrl = require('../controllers/auth');
const customerCtrl = require('../controllers/customer');

const router = express.Router();

router.route('/api/customer')
    .post(authCtrl.requireSignin, customerCtrl.create);

router.route('/api/customers')
    .get(authCtrl.requireSignin, customerCtrl.list);

router.route('/api/customer/:customerId')
    .get(authCtrl.requireSignin, customerCtrl.view)
    .delete(authCtrl.requireSignin, customerCtrl.remove)
    .put(authCtrl.requireSignin, customerCtrl.edit);

router.param('customerId', customerCtrl.findById);

module.exports = router;