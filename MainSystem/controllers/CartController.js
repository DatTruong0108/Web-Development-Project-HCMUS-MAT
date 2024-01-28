const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')
const Order=require('../models/Order')
const Account=require('../models/account.m')
const jwt = require('jsonwebtoken')
const Coupon = require('../models/Coupon.m')

class CartController{
    async index(req,res,next){ 
        const token = req.cookies.token;
        let username;
        let role;
        let avatar;
        let coupons;
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
           coupons = await Coupon.getByCusID(account.ID);
           const customer = await Account.findCustomer(account.ID);
           avatar = customer.avatar;
           req.user=account;
        }
        coupons.forEach(item => {
            const year = item.expireDate.getFullYear();
            const month = (item.expireDate.getMonth() + 1).toString().padStart(2, '0');
            const day = item.expireDate.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}/${month}/${day}`;
            item.formattedDate=formattedDate;
        });
        const couponsJson = JSON.stringify(coupons);
        res.render('cartpage', { user: req.user, role:role, avatar, coupons, couponsJson });
    }

    async buyNow(req,res,next){ 
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
        
        const id = req.params.id;
        const book = await Book.get("id", id);
        const bookName = book.name;
        const bookPrice = book.price;
        const bookImage = book.image;
        const bookID = book.id;

        res.render('buynowpage', { user: req.user, role:role, avatar, bookName, bookPrice, bookImage, bookID });
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
            const couponDisVal= parseFloat(req.cookies.couponDisVal);
            const subTotal = parseFloat(req.cookies.subtotal);
            const shippingFee = parseFloat(2);
            var total = subTotal + shippingFee - couponDisVal;
            
            console.log(total);
            const newOrder=new Order({
                listItems:listId,
                listQuantity:listQuantities,
                userID:parseInt(user.ID),
                status:"pending",
                subTotal: parseFloat(req.cookies.subtotal),
                shippingFee:parseFloat(2),
                couponDisVal: parseFloat(req.cookies.couponDisVal),
                total:total,
                address: req.cookies.address,
                phone:req.cookies.phone,
                date:new Date(req.cookies.time)
            });
            const rs=await Order.insert(newOrder);
            const couponID = req.cookies.couponID;
            const rss = await Coupon.usedCoupon(couponID, req.user.ID);
            const cart=JSON.parse(req.cookies.cart);
            // Lấy danh sách các id từ mảng list
            const listIds = list.map(item => item.id);

            // Lọc các phần tử trong cart có id không trùng với id trong list
            const updatedCart = cart.filter(item => !listIds.includes(item.id));  
            res.cookie('cart', JSON.stringify(updatedCart), { maxAge: 86400000}); // Set maxAge in milliseconds
            res.clearCookie('couponDisVal')
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