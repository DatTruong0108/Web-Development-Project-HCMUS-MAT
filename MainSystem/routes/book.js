const express=require('express');
const route=express.Router();

const upload=require('../middlewares/upload');

const BookController=require('../controllers/BookController');

route.put('/:id',upload.single('image'),BookController.update);
route.delete('/:id',BookController.destroy);
route.post('/store',upload.single('image'),BookController.store);
route.get('/create',BookController.create);
route.get('/:id/edit',BookController.edit);
route.get('/:id/view',BookController.viewDetail);
route.get('/search/paginate',BookController.paginateSearchResults);
route.post('/search',BookController.search);



module.exports=route;