const express = require('express');
const authCtrl = require('../controllers/auth');
const dealerCompanyCtrl = require('../controllers/dealer.company');

const router = express.Router();

router.route('/api/company/dealer')
    .post(authCtrl.requireSignin, dealerCompanyCtrl.create);

router.route('/api/company/dealers')
    .get(authCtrl.requireSignin, dealerCompanyCtrl.list);

router.route('/api/company/dealer/:dealerId')
    .get(authCtrl.requireSignin, dealerCompanyCtrl.view)
    .delete(authCtrl.requireSignin, dealerCompanyCtrl.remove)
    .put(authCtrl.requireSignin, dealerCompanyCtrl.edit);

router.param('dealerId', dealerCompanyCtrl.findById);

module.exports = router;