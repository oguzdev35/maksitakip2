const express = require('express');
const authCtrl = require('../controllers/auth');
const productCategoryCtrl = require('../controllers/product_category');

const router = express.Router();

router.route('/api/product-category')
    .post(authCtrl.requireSignin, productCategoryCtrl.create);

router.route('/api/product-categories')
    .get(authCtrl.requireSignin, productCategoryCtrl.list);

router.route('/api/product-category/:productCategoryId')
    .get(authCtrl.requireSignin, productCategoryCtrl.view)
    .delete(authCtrl.requireSignin, productCategoryCtrl.remove)
    .put(authCtrl.requireSignin, productCategoryCtrl.edit);

router.param('productCategoryId', productCategoryCtrl.findById);

module.exports = router;