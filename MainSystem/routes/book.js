const express=require('express');
const route=express.Router();

const BookController=require('../controllers/BookController');
const Book = require('../models/Book');

route.get('/:id/view',BookController.viewDetail);
route.get('/search/paginate',BookController.paginateSearchResults);
route.post('/search',BookController.search);
route.get('/filterAll/paginate', BookController.filterAllPaginate);
route.get('/filterAll', BookController.filterAll);
// route.get('/filterAuthorIndex', BookController.filterAuthorIndex);

module.exports=route;