const express=require('express');
const route=express.Router();

const upload=require('../middlewares/upload');

const BookController=require('../controllers/BookController');
const Book = require('../models/Book');
const cookieParser = require("cookie-parser");
route.use(cookieParser());
const isAuthenticated=require('../middlewares/authenticate');

route.post('/storeReview',isAuthenticated,BookController.storeReview);

route.put('/:id',upload.single('image'),BookController.update);
route.delete('/:id',BookController.destroy);
route.post('/store',upload.single('image'),BookController.store);

route.get('/create',isAuthenticated,BookController.create);
route.get('/:id/edit',isAuthenticated,BookController.edit);

route.get('/:id/viewAdmin',BookController.viewAdmin);
route.get('/:id/view',BookController.viewDetail);
route.get('/search/paginate',BookController.paginateSearchResults);
route.post('/search',BookController.search);

route.get('/filterAll/page/:page?', BookController.filterAllPaginate);
route.get('/filterAll', BookController.filterAll);
route.get('/ajax/filterAuthor/:authorname/:page?', BookController.filterAuthor);
route.get('/filterAuthor', BookController.filterAuthorIndex);
route.get('/filterPrice', BookController.filterPriceIndex);
route.get('/ajax/filterPrice/:priceRange/:page?', BookController.filterPrice);
// route.post('/filterPrice', BookController.filterPrice);


module.exports=route;