const express=require('express');
const route=express.Router();
const isAuthenticated=require('../middlewares/authenticate')

const userManagementController=require('../controllers/userManagement.c');

route.get('/ajax', userManagementController.getBooksByCategory);
route.get('/', userManagementController.index);
route.get('/filter',userManagementController.getBooksByCategoryFilter);
route.delete('/:id', isAuthenticated, userManagementController.adminDeleteUser);
route.post('/update/:id', isAuthenticated, userManagementController.adminUpdateUser);

module.exports=route;