const express=require('express');
const route=express.Router();

const CategoryController=require('../controllers/CategoryController');

route.get('/:categoryName', CategoryController.getCategoryProducts);
route.get('/:categoryName/:page?', CategoryController.getCategoryProductsPage);
route.get('/', CategoryController.index);
route.get('/:page?', CategoryController.indexPage);

module.exports=route;