const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')
const Order=require('../models/Order')
const Account=require('../models/account.m')
const jwt = require('jsonwebtoken')

class CartController{
    async index(req,res,next){ 
        const token = req.cookies.token;
        let username;
        let role;
        let avatar;
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
           const customer = await Account.findCustomer(account.ID);
           avatar = customer.avatar;
           req.user=account;
        }

        const catgories=await Category.getAll();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const cateName = "all";

        res.render('cartpage', { catgories, user: req.user, role:role, avatar });
    }

    async store(req,res,next){
        const user=req.user;
        console.log(user);
        const list=JSON.parse(req.cookies.list);
        if (list){
            
            const listId=[];
            const listQuantities=[];
            for (var obj of list){
                listId.push(parseInt(obj.id));
                listQuantities.push(parseInt(obj.quantity));
            }
            console.log(listId);
            const newOrder=new Order({
                listItems:listId,
                listQuantity:listQuantities,
                userID:parseInt(user.ID),
                status:"pending",
                subTotal: parseFloat(req.cookies.subtotal),
                shippingFee:parseFloat(2),
                total:parseFloat(req.cookies.subtotal)+parseFloat(2),
                address: req.cookies.address,
                phone:req.cookies.phone,
                date:new Date(req.cookies.time)
            });
            const rs=await Order.insert(newOrder);

            const cart=JSON.parse(req.cookies.cart);
            // Lấy danh sách các id từ mảng list
            const listIds = list.map(item => item.id);

            // Lọc các phần tử trong cart có id không trùng với id trong list
            const updatedCart = cart.filter(item => !listIds.includes(item.id));  
            res.cookie('cart', JSON.stringify(updatedCart), { maxAge: 86400000}); // Set maxAge in milliseconds
            
            res.clearCookie('subtotal');
            res.clearCookie('address');
            res.clearCookie('time');
            res.clearCookie('phone');
            res.clearCookie('list');
            // res.send("Order is created");
            res.redirect('https://localhost:3113/authenticate-payment');
        }
    }
}

module.exports=new CartController;