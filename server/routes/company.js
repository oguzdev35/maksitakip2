const express = require('express');
const authCtrl = require('../controllers/auth');
const companyCtrl = require('../controllers/company');

const router = express.Router();

router.route('/api/company')
    .post(authCtrl.requireSignin, companyCtrl.getAdmin, companyCtrl.create)
    .put(authCtrl.requireSignin, companyCtrl.getAdmin, companyCtrl.edit)
    .get(authCtrl.requireSignin, companyCtrl.getAdmin, companyCtrl.view)

module.exports = router;