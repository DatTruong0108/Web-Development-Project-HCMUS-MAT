const express=require('express');
const route=express.Router();

const CategoryController=require('../controllers/CategoryController');

route.get('/ajax/:categoryName/:page?', CategoryController.getBooksByCategory);
route.get('/', CategoryController.index);

module.exports=route;