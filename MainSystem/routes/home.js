const express=require('express');
const route=express.Router();

const HomeController=require('../controllers/HomeController');

//route.post('/search',HomeController.index);
route.get('/',HomeController.index);


module.exports=route;