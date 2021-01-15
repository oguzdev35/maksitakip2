const express = require('express');
const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.route('/api/user')
    .post(authCtrl.requireSignin, userCtrl.create);

router.route('/api/users')
    .get(authCtrl.requireSignin, userCtrl.list);

router.route('/api/user/:userId')
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.view)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)
    
router.param('userId', userCtrl.findById);

module.exports = router;