const express = require('express');
const authCtrl = require('../controllers/auth');
const transactionCtrl = require('../controllers/transaction');
const accountCtrl = require('../controllers/account');
const personalCtrl = require('../controllers/personal.company');
const dealerCtrl = require('../controllers/dealer.company');
const customerCtrl = require('../controllers/customer');

const router = express.Router();

router.route('/api/transaction/from/external/to/company/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/company/:accountId/to/external')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/personal/:personalId/:accountId/to/company/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/company/:accountId/to/personal/:personalId/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/dealer/:dealerId/:accountId/to/company/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/company/to/dealer/:accountId/:dealerId/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/dealer/:dealerId/:accountId/to/personal/:personalId/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/personal/:personalId/:accountId/to/dealer/:dealerId/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/service/from/customer/:customerId/:accountId/to/company/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/service/from/company/:accountId/to/customer/:customerId/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/product/from/customer/:customerId/:accountId/to/company/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/product/from/company/:accountId/to/customer/:customerId/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/customer/:customerId/:accountId/to/company/:accountId')
    .post(authCtrl.requireSignin)

router.route('/api/transaction/from/company/:accountId/to/customer/:customerId/:accountId')
    .post(authCtrl.requireSignin);


router.param('accountId', accountCtrl.findById);
router.param('personalId', personalCtrl.findById);
router.param('dealerId', dealerCtrl.findById);
router.param('customerId', customerCtrl.findById);

module.exports = router;