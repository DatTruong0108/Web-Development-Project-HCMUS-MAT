const db=require('../utils/db')
const Book=require('../models/Book')
const Account=require('../models/account.m')
const Category=require('../models/Category')
const jwt = require('jsonwebtoken')
const Handlebars = require('handlebars');
const Order = require('../models/Order')
const Transaction=require('../../SubSystem/models/Transaction');
const payAccount=require('../../SubSystem/models/payAccount')
const Coupon = require('../models/Coupon.m')

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

        const coupons = await Coupon.getAllCouponWithPagination(currentPage, itemsPerPage);
        coupons.forEach(item => {
            const year = item.expireDate.getFullYear();
            const month = (item.expireDate.getMonth() + 1).toString().padStart(2, '0');
            const day = item.expireDate.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}/${month}/${day}`;
            item.formattedDate=formattedDate;
        });
        //const totalBooks = await Book.getCount();
        const totalCustomers = await Coupon.getAllCouponCount();
        const totalPages = Math.ceil(totalCustomers / itemsPerPage);
        //const cateName = "all";
        //console.log(orders[0]);
        res.render('admin/couponManagement', { coupons, currentPage, totalPages, user: req.user, role:role});
    }

    async getBooksByCategory(req, res, next) {
        try {
            const {page } = req.query;
            const itemsPerPage = 15;
            const currentPage = req.query.page || 1;
            //var id = req.params.id;
    
            const coupons = await Coupon.getAllCouponWithPagination(currentPage, itemsPerPage);
            coupons.forEach(item => {
                const year = item.expireDate.getFullYear();
                const month = (item.expireDate.getMonth() + 1).toString().padStart(2, '0');
                const day = item.expireDate.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                item.formattedDate=formattedDate;
            });
            //const totalBooks = await Book.getCount();
            const totalCustomers = await Coupon.getAllCouponCount();
            const totalPages = Math.ceil(totalCustomers / itemsPerPage);
            //const cateName = "all";
            //console.log(orders[0]);
            res.json({ coupons, totalPages, currentPage });
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
            var { page } = req.query;
            const itemsPerPage = 15;
            const currentPage = req.query.page || 1;
            //var id = req.params.id;
            
            const coupons = await Coupon.getAllCouponWithPagination(currentPage, itemsPerPage);
            coupons.forEach(item => {
                const year = item.expireDate.getFullYear();
                const month = (item.expireDate.getMonth() + 1).toString().padStart(2, '0');
                const day = item.expireDate.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                item.formattedDate=formattedDate;
            });
            //const totalBooks = await Book.getCount();
            const totalCustomers = await Coupon.getAllCouponCount();
            const totalPages = Math.ceil(totalCustomers / itemsPerPage);
            res.render('admin/couponManagement', { coupons, currentPage, totalPages, user: req.user, role:role});
            //res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async adminDeleteCoupon(req,res,next){ 
        const {id} = req.params;

        try {
            const rs = await Coupon.DeleteCoupon(id);
           
            if(rs) {
                res.redirect('/coupon-management');
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            console.error('Error deleting Account:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async adminAddCoupon(req, res, next) {
        try {
            const { name, expireDate, value, minorder, maxdiscount, quantity, customers } = req.body;
        
            // Validate name and expireDate
            if (!name || !expireDate) {
                return res.json({ isValid: false, message: "Name and expire date are required." });
            }
        
            // Parse value, minorder, maxdiscount, and quantity
            const parsedValue = value !== "" ? parseFloat(value) : 0;
            const parsedMinorder = minorder !== "" ? parseFloat(minorder) : 0;
            const parsedMaxdiscount = maxdiscount !== "" ? parseFloat(maxdiscount) : 0;
            const parsedQuantity = quantity !== "" ? parseInt(quantity) : 0;
        
            // Validate parsed value, minorder, maxdiscount, and quantity
            if (isNaN(parsedValue)) {
                return res.json({ isValid: false, message: "Value must be a number or empty string." });
            }
            if (isNaN(parsedMinorder)) {
                return res.json({ isValid: false, message: "Min order must be a number or empty string." });
            }
            if (isNaN(parsedMaxdiscount)) {
                return res.json({ isValid: false, message: "Max discount must be a number or empty string." });
            }
            if (isNaN(parsedQuantity)) {
                return res.json({ isValid: false, message: "Quantity must be an integer or empty string." });
            }
      
            // Parse customers into an array of integers
            let parsedCustomers = [];
            if (customers) {
                const customerIds = customers.trim().split(/\s+/); // Split by spaces
                parsedCustomers = customerIds.map(customerId => parseInt(customerId, 10)); // Convert each substring to integer
                // Check if any parsed customer is NaN (not a number)
                if (parsedCustomers.some(isNaN)) {
                    return res.json({ isValid: false, message: "Customers must be a string of integers separated by spaces." });
                }
            }
            // Call the AddCoupon function with the validated data
            const newCouponId = await Coupon.AddCoupon({
                name,
                expireDate,
                value: parsedValue,
                minorder: parsedMinorder,
                maxdiscount: parsedMaxdiscount,
                quantity: parsedQuantity,
                customers: parsedCustomers
            });
            const newCoupons = await Coupon.getAllCouponWithPagination("page=1", 15);
            newCoupons.forEach(item => {
                const year = item.expireDate.getFullYear();
                const month = (item.expireDate.getMonth() + 1).toString().padStart(2, '0');
                const day = item.expireDate.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                item.formattedDate=formattedDate;
            });
            //const totalBooks = await Book.getCount();
            const totalCustomers = await Coupon.getAllCouponCount();
            const totalPages = Math.ceil(totalCustomers / 15);
  
            res.json({ isValid: true, message: "Coupon added successfully.", coupons: newCoupons, page:1, totalPages: totalPages });
        } catch (error) {
            // Handle server error
            console.error(error);
            res.json({ isValid: false, message: "Internal server error." });
        }
    }  
}

module.exports=new userManagementController;