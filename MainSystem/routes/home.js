const express=require('express');
const route=express.Router();

const cookieParser = require("cookie-parser");

route.use(cookieParser());

const HomeController=require('../controllers/HomeController');

//route.post('/search',HomeController.index);
route.get('/',HomeController.index);


module.exports=route;