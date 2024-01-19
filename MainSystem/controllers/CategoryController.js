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

handlebars.registerHelper('addinOne', function(value) {
    const page = value;
    const pageNumber = parseInt(page.split('=')[1], 10);
    if(pageNumber == 4){
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

handlebars.registerHelper('getCatName', function (catName) {
    return { catName: catName };
});

class CategoryController{
    async index(req,res,next){ 
        const catgories=await Category.getAll();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        //console.log(currentPage);
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);

        res.render('categorypage', { catgories,  books, currentPage, totalPages });
    }

    async indexPage(req,res,next){ 
        const catgories=await Category.getAll();
        const currentPage = req.params.page;
        // console.log(currentPage);
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);

        res.render('categorypage', { catgories,  books, currentPage, totalPages });
    }

    async getCategoryProducts(req, res, next){
        try {
            const catgories=await Category.getAll(); 
            const cateName = req.params.categoryName;
            const cateID = await Category.getCatIDByName(cateName);

            const currentPageReq = req.params.page || 1;
            const currentPage = 'page=' + currentPageReq;
            // console.log(currentPage);
            const itemsPerPage = 3; // Số sản phẩm trên mỗi trang

            const books = await Book.getBookByIDCategoryWithPagination(cateID, currentPage, itemsPerPage);
            const totalBooks = await Book.getCountByCategory(cateID);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);

            res.render('categorypage', { catgories, books, cateName, currentPage, totalPages});
        } catch (error) {
            next(error);
        }
    }

    async getCategoryProductsPage(req, res, next){
        try {
            const catgories = await Category.getAll(); 
            const cateName = req.params.categoryName;
            const cateID = await Category.getCatIDByName(cateName);
    
            const currentPage = req.params.page || 1;
            // console.log(currentPage);
            const itemsPerPage = 3; // Số sản phẩm trên mỗi trang
    
            const books = await Book.getBookByIDCategoryWithPagination(cateID, currentPage, itemsPerPage);
            const totalBooks = await Book.getCountByCategory(cateID);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
            res.render('categorypage', { catgories, books, cateName, currentPage, totalPages });
        } catch (error) {
            next(error);
        }
    }    
}

module.exports=new CategoryController;