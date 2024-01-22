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

    async filterAll(req, res, next) {
        const itemsPerPage = 8;
        const page = req.query.page || 1;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
    
        const book = await Book.getAll();
        const totalPages = Math.ceil(book.length / itemsPerPage);
    
        const paginatedBook = book.slice(startIndex, endIndex);
    
        res.render('book/searchresultpage', {
            book: paginatedBook,
            totalPages: totalPages,
            currentPage: page
        });
    }

    // async filterAuthorIndex(req, res, next) {
    //     const authors = await Book.getAllAuthors();

    //     const itemsPerPage = 8;
    //     const page = req.query.page || 1;
    //     const startIndex = (page - 1) * itemsPerPage;
    //     const endIndex = startIndex + itemsPerPage;
    
    //     const book = await Book.getAll();
    //     const totalPages = Math.ceil(book.length / itemsPerPage);
    
    //     const paginatedBook = book.slice(startIndex, endIndex);

    //     res.render('book/filterauthor', {
    //         authors: authors,
    //         book: paginatedBook,
    //         totalPages: totalPages,
    //         currentPage: page
    //     });
    // }
}

module.exports=new BookController;