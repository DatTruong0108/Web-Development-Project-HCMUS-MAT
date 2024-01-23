const db = require('../utils/db')
const Book = require('../models/Book')
const Category = require('../models/Category')


class BookController {
    async viewDetail(req, res, next) {
        const bookId = req.params.id;
        const rs = await Book.get('id', bookId);

        if (rs) {
            const catId = rs.catID;
            const relevant = await Book.search('catID', catId);


            res.render('book/view', { book: rs, related: relevant });
        }
        else {
            res.send('No book found');
        }
    }

    async search(req, res, next) {
        const name = req.body.inputName;

        const book1 = await Book.searchLike('name', name);
        const book2 = await Book.searchLike('author', name);
        const book = book1.concat(book2);

        const itemsPerPage = 8;

        if (book) {
            const totalPages = Math.ceil(book.length / itemsPerPage);
            const page = req.query.page || 1;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentPage = 1;

            const paginatedBook = book.slice(startIndex, endIndex);
            return res.render('book/searchresultpage', {
                book: paginatedBook,
                totalPages: totalPages,
                key: name,
                currentPage: currentPage
            });
        }
        else {
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

    async filterAllPaginate(req, res, next) {
        const book = await Book.getAll();

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
        const book = await Book.getAll();

        const itemsPerPage = 8;
        const totalPages = Math.ceil(book.length / itemsPerPage);
        const page = req.query.page || 1;
        const currentPage = 1;

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const paginatedBook = book.slice(startIndex, endIndex);
        return res.render('book/filterall', {
            book: paginatedBook,
            totalPages: totalPages,
            currentPage: currentPage
        });
    }

    async filterAuthorIndex(req, res, next) {
        console.log("filter author index")
        const authors = await Book.getAllAuthors();
        const author = authors[0].author;
        const itemsPerPage = 12;
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;

        // const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        // const totalBooks = await Book.getCount();
        const books = await Book.getBookByAuthorWithPagination("", currentPage, itemsPerPage);
        const totalBooks = await Book.getCountByAuthor(author);
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const authorname = "";

        res.render('book/filterauthor', { authors, books, currentPage, totalPages, authorname });
    }

    async filterAuthor(req, res, next) {
        console.log("go into filter author");
        try {
            const authorName = req.params.authorname;
            console.log(authorName);

            if (authorName === "") {
                const itemsPerPage = 12;
                const currentPage = req.params.page || 1;
                const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
                const totalBooks = await Book.getCount();
                const totalPages = Math.ceil(totalBooks / itemsPerPage);

                return res.json({ books, totalPages });
            }
            else {
                const itemsPerPage = 12;
                const currentPage = req.params.page || 1;
                const books = await Book.getBookByAuthorWithPagination(authorName, currentPage, itemsPerPage);
                const totalBooks = await Book.getCountByAuthor(authorName);
                const totalPages = Math.ceil(totalBooks / itemsPerPage);

                return res.json({ authorName, books, totalPages, currentPage });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async filterPriceIndex(req, res, next) {
        const itemsPerPage = 12;
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const price = "";

        res.render('book/filterprice', { books, currentPage, totalPages, price });
    }

    async filterPrice(req, res, next) {
        try {
            const priceRange = parseInt(req.body.priceRange);
            const itemsPerPage = 12;
            const currentPage = req.params.page || 1;

            let minPrice = 0;
            let maxPrice = 10000.00;

            switch (priceRange) {
                case 1:
                    minPrice = 0.00;
                    maxPrice = 10.00;
                    break;
                case 2:
                    minPrice = 10.00;
                    maxPrice = 20.00;
                    break;
                case 3:
                    minPrice = 20.00;
                    maxPrice = 30.00;
                    break;
                case 4:
                    minPrice = 30.00;
                    maxPrice = 40.00;
                    break;
                case 5:
                    minPrice = 40.00;
                    maxPrice = 10000.00; // No upper limit for the highest range
                    break;
                default:
                    // Handle invalid price range
                    break;
            }
            
            const books = await Book.getBookByPrice(minPrice, maxPrice);
            const totalBooks = books.length;
            const totalPages = Math.ceil(totalBooks / itemsPerPage);

            return res.render('book/filterprice', { 
                priceRange: req.body.priceRange,
                books: books,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BookController;