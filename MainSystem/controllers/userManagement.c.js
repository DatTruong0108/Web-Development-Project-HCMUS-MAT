const db=require('../utils/db')
const Book=require('../models/Book')
const Account=require('../models/account.m')
const Category=require('../models/Category')
const jwt = require('jsonwebtoken')
const Handlebars = require('handlebars');

Handlebars.registerHelper('gte', function (a, b, options) {
    if (a > b) {
        return options.fn(this);
    } else if (options.inverse) {
        return options.inverse(this);
    }
    return '';
});

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
        customers.forEach(item => {
            if(item.dob){
                const year = item.dob.getFullYear();
                const month = (item.dob.getMonth() + 1).toString().padStart(2, '0');
                const day = item.dob.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                item.dobFormat=formattedDate;
            };
            
        });
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
            books.forEach(item => {
                if(item.dob){
                    const year = item.dob.getFullYear();
                    const month = (item.dob.getMonth() + 1).toString().padStart(2, '0');
                    const day = item.dob.getDate().toString().padStart(2, '0');
                    const formattedDate = `${year}/${month}/${day}`;
                    item.dobFormat=formattedDate;
                };
            });
            //console.log(books[0]);
            //console.log(totalBooks);
            res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getBooksByCategoryFilter(req, res, next) {
        try {
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
            var { id, name, range, s, page } = req.query;
            const itemsPerPage = 15;
            const currentPage = req.query.page || 1;
            //var id = req.params.id;
            
            const customers = await Account.getAllCustomerFilterWithPagination(id,name,range,s,currentPage,itemsPerPage);
            const totalBooks = await Account.getAllCustomerFilterCount(id,name,range,s);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
            //console.log(books[0]);
            //console.log(totalBooks);
            customers.forEach(item => {
                if(item.dob){
                    const year = item.dob.getFullYear();
                    const month = (item.dob.getMonth() + 1).toString().padStart(2, '0');
                    const day = item.dob.getDate().toString().padStart(2, '0');
                    const formattedDate = `${year}/${month}/${day}`;
                    item.dobFormat=formattedDate;
                };
            });
            if(id ==="all") id="";
            if(name === "all") name="";
            res.render('admin/usersManagement', { customers, currentPage, totalPages, user: req.user, role:role, balanceRange: range, sortBy: s, customerID: id, customerName: name });
            //res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async adminDeleteUser(req,res,next){ 
        const {id} = req.params;

        try {
            const rs = await Account.DeleteAccount(id);
           
            if(rs) {
                res.redirect('/user-management');
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            console.error('Error deleting Account:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async adminUpdateUser(req,res,next){ 
        const {id} = req.params;

        try {
            const rs = await Account.UpdateStatusAccount(id);
           
            if(rs) {
                res.redirect('/user-management');
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            console.error('Error deleting Account:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }         
}

module.exports=new userManagementController;