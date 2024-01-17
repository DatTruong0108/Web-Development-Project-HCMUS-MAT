const db=require('../utils/db')


class CategoryController{
    async index(req,res,next){ 
        const rs=await db.getAll();   
        const cateNames = rs.map(item => item.name);
        const books = await db.getBooks();
        res.render('categorypage', { cateNames,  books});
    }
}

module.exports=new CategoryController;