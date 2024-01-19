const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')


class CategoryController{
    async index(req,res,next){ 
        const rs=await Category.getAll(); 
        const cateNames = rs.map(item => item.name);
        const books = await Book.getAll();
        res.render('categorypage', { cateNames,  books});
    }
}

module.exports=new CategoryController;