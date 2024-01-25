const express=require('express');
const route=express.Router();

const cookieParser = require("cookie-parser");
route.use(cookieParser());
const isAuthenticated=require('../middlewares/authenticate')
const revenueController = require('../controllers/revenue.c');
const AdminController=require('../controllers/AdminController');

route.get('/category/edit', isAuthenticated, AdminController.adminEditCatePage);
route.get('/category/add', isAuthenticated, AdminController.adminAddCatePage);
route.get('/category', isAuthenticated, AdminController.adminCate);
route.post('/category/addNewCategory', isAuthenticated, AdminController.adminAddCategory);
route.post('/category/delete/:id', isAuthenticated, AdminController.adminDeleteCate);
route.post('/category/edit/:id', isAuthenticated, AdminController.adminEditCategory);
route.get('/ajax/:categoryName/:page?',isAuthenticated, AdminController.getBooksByCategory);
route.get('/showProducts',isAuthenticated, AdminController.showProducts);
route.get('/revenue', isAuthenticated, revenueController.getRevenue);
route.post('/revenue', isAuthenticated, revenueController.postRevenue);

module.exports=route;