const express=require('express');
const route=express.Router();

const BookController=require('../controllers/BookController');
const Book = require('../models/Book');

route.get('/:id/view',BookController.viewDetail);
route.get('/search/paginate',BookController.paginateSearchResults);
route.post('/search',BookController.search);
route.get('/filterAll/page/:page?', BookController.filterAllPaginate);
route.get('/filterAll', BookController.filterAll);
route.get('/ajax/filterAuthor/:authorname/:page?', BookController.filterAuthor);
route.get('/filterAuthor', BookController.filterAuthorIndex);

module.exports=route;