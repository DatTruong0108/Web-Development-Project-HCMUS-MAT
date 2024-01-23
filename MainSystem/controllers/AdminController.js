const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')

class AdminController{
    async showProducts(req,res,next){ 
        const catgories=await Category.getAll();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const cateName = "all";

        res.render('admin/showProduct', { catgories,  books, currentPage, totalPages, cateName });
    }

    async getBooksByCategory(req, res, next) {
        try {
            const cateName = req.params.categoryName;
            let cateID;
    
            if (cateName.toLowerCase() === 'all') {
                const itemsPerPage = 9;
                const currentPage = req.params.page || 1;
                const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
                const totalBooks = await Book.getCount();
                const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
                return res.json({ books, totalPages });
            } else {
                cateID = await Category.getCatIDByName(cateName);
            }
    
            const currentPage = req.params.page || 1;
            const itemsPerPage = 6;
    
            const books = await Book.getBookByIDCategoryWithPagination(cateID, currentPage, itemsPerPage);
            const totalBooks = await Book.getCountByCategory(cateID);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
            res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    
}

module.exports=new AdminController;