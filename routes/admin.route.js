  const express = require("express")
  ,     router = express.Router()
  ,     adminController = require('../controllers/admin.controller');
  
 router.route('/')
 .get(adminController.getUserList);
  

  router.route('/user:id')
 
  .delete(adminController.deleteUser);
  
  
  
  
  
  module.exports = router;