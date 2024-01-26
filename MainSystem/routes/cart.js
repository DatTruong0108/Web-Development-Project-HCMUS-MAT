const express=require('express');
const route=express.Router();

const CartController=require('../controllers/CartController');
const cookieParser = require("cookie-parser");
route.use(cookieParser());
const isAuthenticated=require('../middlewares/authenticate')

route.get('/buynow/:id',CartController.buyNow);
route.get('/',CartController.index);
route.get('/order',isAuthenticated,CartController.store);

module.exports=route;