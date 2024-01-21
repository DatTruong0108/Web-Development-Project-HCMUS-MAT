const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')
const handlebars = require('handlebars');

handlebars.registerHelper('currentPage', function() {
    return this.currentPage;
});


handlebars.registerHelper('subtractOne', function(value) {
    const page = value;
    const pageNumber = parseInt(page.split('=')[1], 10);
    if(pageNumber == 1){
        return value;
    }
    const prePage = pageNumber - 1;
    const rs = 'page=' + prePage

    return rs;
})

handlebars.registerHelper('addinOne', function(value, totalPages) {
    const page = value;
    const pageNumber = parseInt(page.split('=')[1], 10);
    if(pageNumber == totalPages){
        return value;
    }
    const nextPage = pageNumber + 1;
    const rs = 'page=' + nextPage

    return rs;
})

handlebars.registerHelper('range', function (start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
});

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

class CategoryController{
    async index(req,res,next){ 
        const catgories=await Category.getAll();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const cateName = "all";

        res.render('categorypage', { catgories,  books, currentPage, totalPages, cateName });
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
            const itemsPerPage = 3;
    
            const books = await Book.getBookByIDCategoryWithPagination(cateID, currentPage, itemsPerPage);
            const totalBooks = await Book.getCountByCategory(cateID);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
            res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    
}

module.exports=new CategoryController;