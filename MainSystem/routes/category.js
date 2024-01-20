const express=require('express');
const route=express.Router();

const CategoryController=require('../controllers/CategoryController');

route.get('/all/:page?', CategoryController.indexPage);
route.get('/:categoryName', CategoryController.getCategoryProducts);
route.get('/:categoryName/:page?', CategoryController.getCategoryProductsPage);
route.get('/', CategoryController.index);

module.exports=route;