const express = require('express');
const authCtrl = require('../controllers/auth');
const inventoryCategoryCtrl = require('../controllers/inventory');

const router = express.Router();

router.route('/api/inventory')
    .post(authCtrl.requireSignin, inventoryCategoryCtrl.create);

router.route('/api/inventories')
    .get(authCtrl.requireSignin, inventoryCategoryCtrl.list);

router.route('/api/inventory/:inventoryId')
    .get(authCtrl.requireSignin, inventoryCategoryCtrl.view)
    .delete(authCtrl.requireSignin, inventoryCategoryCtrl.remove)
    .put(authCtrl.requireSignin, inventoryCategoryCtrl.edit);

router.param('inventoryId', inventoryCategoryCtrl.findById);

module.exports = router;