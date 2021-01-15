const express = require('express');
const authCtrl = require('../controllers/auth');
const serviceCategoryCtrl = require('../controllers/service');

const router = express.Router();

router.route('/api/service')
    .post(authCtrl.requireSignin, serviceCategoryCtrl.create);

router.route('/api/services')
    .get(authCtrl.requireSignin, serviceCategoryCtrl.list);

router.route('/api/service/:serviceId')
    .get(authCtrl.requireSignin, serviceCategoryCtrl.view)
    .delete(authCtrl.requireSignin, serviceCategoryCtrl.remove)
    .put(authCtrl.requireSignin, serviceCategoryCtrl.edit);

router.param('serviceId', serviceCategoryCtrl.findById);

module.exports = router;