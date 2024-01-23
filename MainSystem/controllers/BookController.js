const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category');
const path = require('path');

const IMAGE_UPLOAD_PATH='Images\\Books\\';

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

    async search(req, res, next) {
        const name = req.body.inputName;
       
        const book1=await Book.searchLike('name',name);
        const book2=await Book.searchLike('author',name);
        const book=book1.concat(book2);

        const itemsPerPage=8;

        if(book) {
            const totalPages = Math.ceil(book.length / itemsPerPage);
            const page = req.query.page || 1;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentPage=1;

            const paginatedBook = book.slice(startIndex, endIndex);
            return res.render('book/searchresultpage', { 
                book: paginatedBook,
                totalPages: totalPages,
                key: name,
                currentPage: currentPage
            });
        }
        else{
           return res.send("No book found");
        }     
    }

    async paginateSearchResults(req, res, next) {
        const name = req.query.inputName;
        const book1 = await Book.searchLike('name', name);
        const book2 = await Book.searchLike('author', name);
        const book = book1.concat(book2);
    
        const itemsPerPage = 8;
        const totalPages = Math.ceil(book.length / itemsPerPage);
    
        const page = req.query.page || 1;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
       
    
        const paginatedBook = book.slice(startIndex, endIndex);
    
        res.json({
            book: paginatedBook,
            totalPages: totalPages,
            currentPage: page
        });
    }

    async create(req,res,next){
        const cats=await Category.getAll();
        res.render('book/create',{categories: cats});
    }

    async edit (req,res,next){
        const bookId=req.params.id;
        const cats=await Category.getAll();
        const book=await Book.get('id',parseInt(bookId));
        const currenCat=await Category.get(parseInt(book.catID));
       
        console.log(book);

        res.render('book/edit',{book:book, categories: cats, cate: currenCat})
    }

    async store(req,res,next){
        const image=req.file;
        if (!image){
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const imagePath=path.join(IMAGE_UPLOAD_PATH, image.filename);
        const newBook=new Book({
            name:req.body.name,
            author:req.body.author,
            catID:parseInt(req.body.catID),
            image:imagePath,
            price: req.body.price,
            catID:req.body.catID,
            description:req.body.description,
            releaseDate:req.body.releaseDate,
            sold:0,
            quantity:parseInt(req.body.quantity)
        })

        const rs=await Book.insert(newBook);
        res.redirect('/admin/showProducts');
    }

    async update(req,res,next){
        const rs=await Book.get('id',req.params.id);
        const image = req.file;
        var imagePath;
        var date;
      
        if (image){
            imagePath = path.join(IMAGE_UPLOAD_PATH, image.filename);
        }
        else{
            imagePath=rs.image;
        }

        if (req.body.releaseDate && req.body.releaseDate!=null){
            date=req.body.releaseDate;
        }
        else{
            date=rs.releaseDate;
        }

        const newProduct=new Book({
            name:req.body.name,
            author:req.body.author,
            catID:parseInt(req.body.catID),
            image:imagePath,
            price: req.body.price,
            catID:req.body.catID,
            description:req.body.description,
            quantity:parseInt(req.body.quantity),
            releaseDate:date,
        });
        const data=await Book.update(newProduct,parseInt(req.params.id));
        res.redirect('/admin/showProducts');
    }

    async destroy(req,res,next){
        const rs=Book.delete(req.params.id);
        res.redirect('/admin/showProducts');
    }
}

module.exports=new BookController;