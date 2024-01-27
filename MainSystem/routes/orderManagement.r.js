const express=require('express');
const route=express.Router();
const isAuthenticated=require('../middlewares/authenticate')

const orderManagement=require('../controllers/orderManagement.c');

route.get('/ajax', orderManagement.getBooksByCategory);
route.get('/', orderManagement.index);
route.get('/filter',orderManagement.getBooksByCategoryFilter);
route.post('/shipping/:id', isAuthenticated, orderManagement.adminUpdateUser);
route.post('/received/:id', isAuthenticated, orderManagement.adminUpdateUser);
route.post('/cancel/:id', isAuthenticated, orderManagement.adminCancelOrder);

module.exports=route;