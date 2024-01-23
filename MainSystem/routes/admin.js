const express=require('express');
const route=express.Router();

const cookieParser = require("cookie-parser");

route.use(cookieParser());

const isAuthenticated=require('../middlewares/authenticate')

const AdminController=require('../controllers/AdminController');

route.get('/ajax/:categoryName/:page?',isAuthenticated, AdminController.getBooksByCategory);
route.get('/showProducts',isAuthenticated, AdminController.showProducts);

module.exports=route;