const express=require('express');
const route=express.Router();
const isAuthenticated=require('../middlewares/authenticate')

const orderManagement=require('../controllers/orderManagement.c');

route.get('/ajax', orderManagement.getBooksByCategory);
route.get('/', orderManagement.index);
route.get('/filter',orderManagement.getBooksByCategoryFilter);
route.delete('/:id', isAuthenticated, orderManagement.adminDeleteUser);
route.post('/update/:id', isAuthenticated, orderManagement.adminUpdateUser);

module.exports=route;