const express = require('express');
const authCtrl = require('../controllers/auth');
const personalCompanyCtrl = require('../controllers/personal.company');

const router = express.Router();

router.route('/api/company/personal')
    .post(authCtrl.requireSignin, personalCompanyCtrl.create);

router.route('/api/company/personals')
    .get(authCtrl.requireSignin, personalCompanyCtrl.list);

router.route('/api/company/personal/:personalId')
    .get(authCtrl.requireSignin, personalCompanyCtrl.view)
    .delete(authCtrl.requireSignin, personalCompanyCtrl.remove)
    .put(authCtrl.requireSignin, personalCompanyCtrl.edit);

router.param('personalId', personalCompanyCtrl.findById);

module.exports = router;