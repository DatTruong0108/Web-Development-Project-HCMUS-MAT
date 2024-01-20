const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')


class BookController{
    async viewDetail(req,res,next){ 
        const bookId=req.params.id;
        const rs=await Book.get('id',bookId);
        
        if (rs){
            const catId=rs.catID;
            const relevant=await Book.search('catID',catId);


            res.render('book/view',{book:rs,related:relevant});
        }
        else{
            res.send('No book found');
        }

       
    }
}

module.exports=new BookController;