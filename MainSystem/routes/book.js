const express=require('express');
const route=express.Router();

const BookController=require('../controllers/BookController');
const Book = require('../models/Book');

route.get('/:id/view',BookController.viewDetail);
route.get('/search/paginate',BookController.paginateSearchResults);
route.post('/search',BookController.search);
route.get('/filterAll/paginate', BookController.filterAllPaginate);
route.get('/filterAll', BookController.filterAll);
route.get('/ajax/filterAuthor/:authorname/:page?', BookController.filterAuthor);
route.get('/filterAuthor', BookController.filterAuthorIndex);
route.get('/filterPrice', BookController.filterPriceIndex);
route.post('/filterPrice', BookController.filterPrice);

module.exports=route;