const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')

class CartController{
    async index(req,res,next){ 
        const catgories=await Category.getAll();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const cateName = "all";

        res.render('cartpage', { catgories });
    }
}

module.exports=new CartController;