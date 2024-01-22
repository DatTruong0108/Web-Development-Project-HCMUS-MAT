const express=require('express');
const route=express.Router();

const CartController=require('../controllers/CartController');

route.get('/',CartController.index);

module.exports=route;