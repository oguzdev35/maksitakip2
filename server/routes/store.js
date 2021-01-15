const express = require('express');
const authCtrl = require('../controllers/auth');
const storeCtrl = require('../controllers/store');

const router = express.Router();

router.route('/api/store')
    .post(authCtrl.requireSignin, storeCtrl.create);

router.route('/api/stores')
    .get(authCtrl.requireSignin, storeCtrl.list);

router.route('/api/store/:storeId')
    .get(authCtrl.requireSignin, storeCtrl.view)
    .delete(authCtrl.requireSignin, storeCtrl.remove)
    .put(authCtrl.requireSignin, storeCtrl.edit);

router.param('storeId', storeCtrl.findById);

module.exports = router;