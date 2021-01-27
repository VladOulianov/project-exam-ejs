const express = require("express")
,     router = express.Router()
,     indexController = require('../controllers/index.controller');

//const verifyUsersAuth = require('../middlewares/user.auth.middleware');

router.route('/')
.get(indexController.getIndexPage)
.post(indexController.postLegume);
router.route('/legume:id')
.delete(indexController.deletelegume);





module.exports = router;