const express=require('express');
const route=express.Router();

const AdminController=require('../controllers/AdminController');

route.get('/ajax/:categoryName/:page?', AdminController.getBooksByCategory);
route.get('/showProducts', AdminController.showProducts);

module.exports=route;