const express=require('express');
const route=express.Router();

const BookController=require('../controllers/BookController');

route.get('/:id/view',BookController.viewDetail);


module.exports=route;