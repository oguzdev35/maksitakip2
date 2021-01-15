const express = require('express');
const authCtrl = require('../controllers/auth');
const storeCategoryCtrl = require('../controllers/store');

const router = express.Router();

router.route('/api/store')
    .post(authCtrl.requireSignin, storeCategoryCtrl.create);

router.route('/api/stores')
    .get(authCtrl.requireSignin, storeCategoryCtrl.list);

router.route('/api/store/:storeId')
    .get(authCtrl.requireSignin, storeCategoryCtrl.view)
    .delete(authCtrl.requireSignin, storeCategoryCtrl.remove)
    .put(authCtrl.requireSignin, storeCategoryCtrl.edit);

router.param('storeId', storeCategoryCtrl.findById);

module.exports = router;