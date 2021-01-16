const express = require('express');
const authCtrl = require('../controllers/auth');
const accountCtrl = require('../controllers/account');
const customerCtrl = require('../controllers/customer');
const personalCtrl = require('../controllers/personal.company');
const dealerCtrl = require('../controllers/dealer.company');


const router = express.Router();

router.route('/api/account/company')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner('create')('company') ,accountCtrl.create);
router.route('/api/account/customer/:customerId')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner('create')('customer') ,accountCtrl.create);
router.route('/api/account/personal/:personalId')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner('create')('personal') ,accountCtrl.create);
router.route('/api/account/dealer/:dealerId')
    .post(authCtrl.requireSignin, accountCtrl.injectAccountOwner('create')('dealer') ,accountCtrl.create);

router.route('/api/accounts/company')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_category')('company') ,accountCtrl.listByCategory);
router.route('/api/accounts/personal')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_category')('personal') ,accountCtrl.listByCategory);
router.route('/api/accounts/dealer')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_category')('dealer') ,accountCtrl.listByCategory);
router.route('/api/accounts/customer')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_category')('customer') ,accountCtrl.listByCategory);

router.route('/api/accounts/personal/:personalId')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_owner')('personal') ,accountCtrl.listByOwner);
router.route('/api/accounts/dealer/:dealerId')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_owner')('dealer') ,accountCtrl.listByOwner);
router.route('/api/accounts/customer/:customerId')
    .get(authCtrl.requireSignin, accountCtrl.injectAccountOwner('list_by_owner')('customer') ,accountCtrl.listByOwner);


router.route('/api/accounts')
    .get(authCtrl.requireSignin, accountCtrl.listAll);

router.route('/api/account/:accountId')
    .get(authCtrl.requireSignin, accountCtrl.view)
    .delete(authCtrl.requireSignin, accountCtrl.remove)
    .put(authCtrl.requireSignin, accountCtrl.edit);

router.param('accountId', accountCtrl.findById);
router.param('customerId', customerCtrl.findById);
router.param('personalId', personalCtrl.findById);
router.param('dealerId', dealerCtrl.findById);

module.exports = router;