const db=require('../utils/db')
const Book=require('../models/Book')
const Account=require('../models/account.m')
const Category=require('../models/Category')
const jwt = require('jsonwebtoken')

class userManagementController{
    async index(req,res,next){ 
        const token = req.cookies.token;
        let username;
        let role;
        if (token)
        {
         jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
           });
           const account = await Account.findAccount(username);
           req.user=account;
        }
        //const customers = await Account.getAllCustomer();
        // const catgories=await Category.getAll();
        // const authors = await Book.getAllAuthors();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 15;

        const customers = await Account.getAllCustomerWithPagination(currentPage, itemsPerPage);
        //const totalBooks = await Book.getCount();
        const totalCustomers = await Account.getAllCustomerCount();
        const totalPages = Math.ceil(totalCustomers / itemsPerPage);
        //const cateName = "all";
        //console.log(customers[0]);
        res.render('admin/usersManagement', { customers, currentPage, totalPages, user: req.user, role:role, balanceRange: '0', sortBy: '0' });
    }

    async getBooksByCategory(req, res, next) {
        try {
            const { id, name, range, s, page } = req.query;
            const itemsPerPage = 15;
            const currentPage = req.query.page || 1;
            //var id = req.params.id;
    
            const books = await Account.getAllCustomerFilterWithPagination(id,name,range,s,currentPage,itemsPerPage);
            const totalBooks = await Account.getAllCustomerFilterCount(id,name,range,s);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
            console.log(books[0]);
            console.log(totalBooks);
            res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    
}

module.exports=new userManagementController;