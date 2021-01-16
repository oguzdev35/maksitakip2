const express = require('express');
const authCtrl = require('../controllers/auth');
const transactionCtrl = require('../controllers/transaction');
const accountCtrl = require('../controllers/account');
const personalCtrl = require('../controllers/personal.company');
const dealerCtrl = require('../controllers/dealer.company');
const customerCtrl = require('../controllers/customer');

/** from models/transactions
 * transfer: {
 *      1: transfer Money from external to Company
 *      2: transfer Money from Company from external
 *      3: transfer Money from Personal to Company
 *      4: transfer Money from Company from Personal
 *      5: transfer Money from Dealer to Company
 *      6: transfer Money from Company from Dealer
 *      7: transfer Money from Dealer to Personal
 *      8: transfer Money from Personal from Dealer
 *      9: transfer Service from Customer to Company
 *      10: transfer Service from Company from Customer
 *      11: transfer Product from Customer to Company
 *      12: transfer Product from Company from Customer
 *      13: transfer Money from Customer to Company
 *      14: transfer Money from Company from Customer
 * }
 */

const router = express.Router();

router.route('/api/transaction/from/external/to/company/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(1), transactionCtrl.create);

router.route('/api/transaction/from/company/:sourceAccountId/to/external')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(2), transactionCtrl.create);

router.route('/api/transaction/from/personal/:personalId/:sourceAccountId/to/company/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(3), transactionCtrl.create)

router.route('/api/transaction/from/company/:sourceAccountId/to/personal/:personalId/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(4), transactionCtrl.create)

router.route('/api/transaction/from/dealer/:dealerId/:sourceAccountId/to/company/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(5), transactionCtrl.create)

router.route('/api/transaction/from/company/:sourceAccountId/to/dealer/:dealerId/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(6), transactionCtrl.create)

router.route('/api/transaction/from/dealer/:dealerId/:sourceAccountId/to/personal/:personalId/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(7), transactionCtrl.create)

router.route('/api/transaction/from/personal/:personalId/:sourceAccountId/to/dealer/:dealerId/:destAccountId')
    .post(authCtrl.requireSignin, transactionCtrl.injectBodyProps(8), transactionCtrl.create)

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

module.exports = router;