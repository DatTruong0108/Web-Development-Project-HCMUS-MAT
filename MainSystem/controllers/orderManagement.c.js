const db=require('../utils/db')
const Book=require('../models/Book')
const Account=require('../models/account.m')
const Category=require('../models/Category')
const jwt = require('jsonwebtoken')
const Handlebars = require('handlebars');
const Order = require('../models/Order')
const Transaction=require('../../SubSystem/models/Transaction');
const payAccount=require('../../SubSystem/models/payAccount')

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

        const orders = await Order.getAllOrderWithPagination(currentPage, itemsPerPage);
        orders.forEach(item => {
            const year = item.date.getFullYear();
            const month = (item.date.getMonth() + 1).toString().padStart(2, '0');
            const day = item.date.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}/${month}/${day}`;
            item.formattedDate=formattedDate;
        });
        //const totalBooks = await Book.getCount();
        const totalCustomers = await Order.getAllOrderCount();
        const totalPages = Math.ceil(totalCustomers / itemsPerPage);
        //const cateName = "all";
        //console.log(orders[0]);
        res.render('admin/orderManagement', { orders, currentPage, totalPages, user: req.user, role:role, balanceRange: '0', sortBy: '0' });
    }

    async getBooksByCategory(req, res, next) {
        try {
            const { id, orderID, range, s, page } = req.query;
            const itemsPerPage = 15;
            const currentPage = req.query.page || 1;
            //var id = req.params.id;
    
            const orders = await Order.getAllOrderFilterWithPagination(id,orderID,range,s,currentPage,itemsPerPage);
            const totalBooks = await Order.getAllOrderFilterCount(id,orderID,range,s);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
            //console.log(books[0]);
            //console.log(totalBooks);
            orders.forEach(item => {
                const year = item.date.getFullYear();
                const month = (item.date.getMonth() + 1).toString().padStart(2, '0');
                const day = item.date.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                item.formattedDate=formattedDate;
            });
            res.json({ orders, totalPages, currentPage });
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
            var { id, orderID, range, s, page } = req.query;
            const itemsPerPage = 15;
            const currentPage = req.query.page || 1;
            //var id = req.params.id;
            
            const orders = await Order.getAllOrderFilterWithPagination(id,orderID,range,s,currentPage,itemsPerPage);
            const totalBooks = await Order.getAllOrderFilterCount(id,orderID,range,s);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
            //console.log(books[0]);
            //console.log(totalBooks);
            orders.forEach(item => {
                const year = item.date.getFullYear();
                const month = (item.date.getMonth() + 1).toString().padStart(2, '0');
                const day = item.date.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                item.formattedDate=formattedDate;
            });
            if(id ==="all") id="";
            if(orderID === "all") orderID="";
            res.render('admin/orderManagement', { orders, currentPage, totalPages, user: req.user, role:role, balanceRange: range, sortBy: s, customerID: id, orderID: orderID });
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
            const rs = await Order.UpdateStatusAccount(id);
            const order=await Order.getByID(id);
            
            if (order.status="received"){  
                const listItems=order.listItems;
                const listQuantity=order.listQuantity;
                console.log(listItems);
                console.log(listQuantity);
                for (let i=0; i<listItems.length; i++){
                    const book=await Book.get('id',listItems[i]);
                    await Book.updateQuantities(book.sold+listQuantity[i],listItems[i]);
                }           
             }
           
            if(rs) {
                res.redirect('/order-management');
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            console.error('Error deleting Account:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async adminCancelOrder(req,res,next){ 
        const {id} = req.params;

        const order=await Order.getByID(parseInt(id));
        if (order.status=="paid" || order.status=="shipping"){
          let mainAccount = await payAccount.get('id', 1);
          const rs = await payAccount.updateBalance(mainAccount.balance - order.total, 1);

         //Increase receiver's balance
          let account = await payAccount.get('id',order.userID);
          const rs2 = await payAccount.updateBalance(account.balance + order.total,order.userID);

          const newTrans = new Transaction({
           senderID: 1,
           receiverID:order.userID,
           orderID: id,
           amount: order.total,
           content: `Refund for order ${id}`,
           date: new Date().toISOString().split('T')[0]
           });

          const resu=await Transaction.insert(newTrans);   
        }

        try {
            const rs = await Order.CancelOrder(id);
            
            if(rs) {
                res.redirect('/order-management');
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