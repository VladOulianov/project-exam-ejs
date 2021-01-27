const express = require("express")
,     router = express.Router()
,     userController = require('../controllers/user.controller')
,     userLoginController = require('../controllers/user.login.controller')
,     userRegisterController = require('../controllers/user.register.controller');



router.route('/option',)
.get(userController.getUserOption)
.put(userController.putUserOption);

router.route('/option/password')
.put(userController.putUserPassword);


// REGISTER
router.route('/register')
    .get(userRegisterController.getRegisterPage)
    .post(userRegisterController.postRegister);



// LOGIN
router.route('/login')
    .get(userLoginController.getLoginPage)
    .post(userLoginController.postLogin);


// LOGOUT
router.route('/logout')
    .get(userLoginController.getLogout);



module.exports = router;