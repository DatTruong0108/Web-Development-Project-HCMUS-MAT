const express=require('express');
const route=express.Router();

const cookieParser = require("cookie-parser");

route.use(cookieParser());

const HomeController=require('../controllers/HomeController');

//route.post('/search',HomeController.index);
route.get('/profile',HomeController.profile);
route.get('/',HomeController.index);

route.post('/profile/edit',HomeController.profileEdit);
route.post('/profile/upload',HomeController.profileUpload);


module.exports=route;