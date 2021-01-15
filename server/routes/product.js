const express = require('express');
const authCtrl = require('../controllers/auth');
const productCtrl = require('../controllers/product');

const router = express.Router();

router.route('/api/product')
    .post(authCtrl.requireSignin, productCtrl.create);

router.route('/api/products')
    .get(authCtrl.requireSignin, productCtrl.list);

router.route('/api/product/:productId')
    .get(authCtrl.requireSignin, productCtrl.view)
    .delete(authCtrl.requireSignin, productCtrl.remove)
    .put(authCtrl.requireSignin, productCtrl.edit);

router.param('productId', productCtrl.findById);

module.exports = router;