const express = require('express');
const authCtrl = require('../controllers/auth');
const accountCtrl = require('../controllers/account');
const customerCtrl = require('../controllers/customer');
const personalCtrl = require('../controllers/personal.company');
const dealerCtrl = require('../controllers/dealer.company');


const router = express.Router();

router.route('/api/account/company')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner ,accountCtrl.create);
router.route('/api/account/customer/:customerId')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner ,accountCtrl.create);
router.route('/api/account/personal/:personalId')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner ,accountCtrl.create);
router.route('/api/account/dealer/:dealerId')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner ,accountCtrl.create);

router.route('/api/accounts')
    .get(authCtrl.requireSignin, accountCtrl.list);

router.route('/api/account/:accountId')
    .get(authCtrl.requireSignin, accountCtrl.view)
    .delete(authCtrl.requireSignin, accountCtrl.remove)
    .put(authCtrl.requireSignin, accountCtrl.edit);

router.param('accountId', accountCtrl.findById);
router.param('customerId', customerCtrl.findById);
router.param('personalId', personalCtrl.findById);
router.param('dealerId', dealerCtrl.findById);

module.exports = router;