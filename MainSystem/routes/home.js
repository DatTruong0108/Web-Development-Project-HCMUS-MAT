const express=require('express');
const route=express.Router();

const HomeController=require('../controllers/HomeController');

/* Admin CRU category */
route.get('/admin/category/edit', HomeController.adminEditCatePage);
route.get('/admin/category/add', HomeController.adminAddCatePage);
route.get('/admin/category', HomeController.adminCate);
route.post('/admin/category/addNewCategory', HomeController.adminAddCategory);
route.post('/admin/category/delete/:id', HomeController.adminDeleteCate);
route.post('/admin/category/edit/:id', HomeController.adminEditCategory);


//route.post('/search',HomeController.index);
route.get('/profile',HomeController.profile);
route.get('/',HomeController.index);


module.exports=route;