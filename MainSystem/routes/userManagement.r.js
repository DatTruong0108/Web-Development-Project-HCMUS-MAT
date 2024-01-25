const express=require('express');
const route=express.Router();

const userManagementController=require('../controllers/userManagement.c');

route.get('/ajax', userManagementController.getBooksByCategory);
route.get('/', userManagementController.index);

module.exports=route;