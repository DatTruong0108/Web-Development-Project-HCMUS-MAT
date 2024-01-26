const db = require('../utils/db')
const Book = require('../models/Book')
const Account= require('../models/account.m');
const { use } = require('passport');
const jwt = require('jsonwebtoken')
const Category=require('../models/Category')
const fs = require('fs');
const Order = require('../models/Order');
const OrderHistory = require('../models/OrderHistory'); 

const Handlebars = require('handlebars');

Handlebars.registerHelper('formatDate', function(date) {
    let formattedDate;
    if(date){
        formattedDate = new Date(date).toLocaleDateString('en-GB');
    } else{
        formattedDate = '';
    }

    return formattedDate;
});

Handlebars.registerHelper('getPriceQuantity', function(prices, quantities) {
    let result = '';

    if (prices && quantities && prices.length === quantities.length) {
        for (let i = 0; i < prices.length; i++) {
            result += `${prices[i]} x ${quantities[i]}`;
            if (i < prices.length - 1) {
                result += '<br>';
                result += '<br>';
            }
        }
    }

    return new Handlebars.SafeString(result);
});

class HomeController {
    async index(req, res, next) {
        const latestRelease = await Book.getLatestRelease();
        const bestSelling = await Book.getBestSelling();
        
        let username;
        let role;
        let avatar;
        const token = req.cookies.token;
        if (token){
            // Lấy token từ cookie
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token không hợp lệ." });
                } else {
                    username = decoded.username;
                    role=decoded.role;
                }
            });
            
            const account = await Account.findAccount(username);
            if (!account) {
                res.clearCookie('token');
                return res.redirect('/');
            }
            if(role === "user"){
                const customer = await Account.findCustomer(account.ID);
                avatar = customer.avatar;
                res.render('homepage', { bestSelling: bestSelling, latestRelease: latestRelease,user:account, role: role, avatar });    
            } else{
                res.render('homepage', { bestSelling: bestSelling, latestRelease: latestRelease,user:account, role: role });    
            }
        }
        else{          
            res.render('homepage', { bestSelling: bestSelling, latestRelease: latestRelease});
        }
    }

    async orderHistory(req, res, next) {
        let username;
        let role;
        const token = req.cookies.token;

        // Lấy token từ cookie
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
        });
        
        const account = await Account.findAccount(username);
        if (!account) {
            res.clearCookie('token');
            return res.redirect('/');
        }

        let avatar
        const customer = await Account.findCustomer(account.ID);
        avatar = customer.avatar;
        const list = await Order.findListOrder(account.ID);
        // Tạo một listOrder mới
        let listOrder = [];

        for (const order of list) {
            // Lọc id sách tồn tại
            const existingBookIds = [];

            for (const itemId of order.listItems) {
                const book = await Book.get("id", itemId);
                if (book !== null) {
                    existingBookIds.push(itemId);
                }
            }

            // Kiểm tra nếu có sách tồn tại thì thêm vào listOrder
            if (existingBookIds.length > 0) {
                // Tạo các mảng để lưu thông tin của từng sách trong order
                let listNames = [];
                let listPrices = [];
                let listQuantity = [];
                let listItems=[];

                // Lặp qua từng itemId trong existingBookIds để lấy thông tin và thêm vào các mảng
                for (const itemId of existingBookIds) {
                    const book = await Book.get("id", itemId);

                    if (book !== null) {
                        listItems.push(book);
                        listNames.push(book.name);
                        listPrices.push(book.price);
                        listQuantity.push(order.listQuantity[order.listItems.indexOf(itemId)]);
                    }
                }

                const filteredOrder = new OrderHistory({
                    id: order.id,
                    listItems:listItems,
                    listNames: listNames,
                    listPrices: listPrices,
                    listQuantity: listQuantity,
                    userID: order.userID,
                    status: order.status,
                    subTotal: order.subTotal,
                    shippingFee: order.shippingFee,
                    date: order.date,
                    total: order.total
                });

                listOrder.push(filteredOrder);
            }
        }

        // Sắp xếp listOrder theo thứ tự giảm dần của date
        listOrder.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        res.render('orderhistorypage', { avatar, user:account, role: role, listOrder });    
    }

    async profile(req, res, next) {
        let username;
        let role;
        const token = req.cookies.token;

        // Lấy token từ cookie
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
        });
        
        const account = await Account.findAccount(username);
        if (!account) {
            res.clearCookie('token');
            return res.redirect('/');
        }

        let fullname, birthday, email, gender, address, avatar
        const customer = await Account.findCustomer(account.ID);
        fullname = customer.fullname;
        birthday = new Date(customer.dob);
        var year = birthday.getFullYear();
        var month = birthday.getMonth() + 1; 
        var day = birthday.getDate();
        birthday = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
        email = customer.email;
        gender = customer.gender;
        address = customer.address;
        avatar = customer.avatar;

        res.render('profilepage', {fullname, birthday, email, gender, address, avatar, user:account, role: role });    
    }

    async profileEdit(req, res, next) {
        let username;
        let role;
        const token = req.cookies.token;

        // Lấy token từ cookie
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
        });
        
        const account = await Account.findAccount(username);
        if (!account) {
            res.clearCookie('token');
            return res.redirect('/');
        }

        let fullname, birthday, email, gender, address, avatar
        const customer = await Account.findCustomer(account.ID);
        fullname = customer.fullname;
        birthday = new Date(customer.dob);
        var year = birthday.getFullYear();
        var month = birthday.getMonth() + 1; 
        var day = birthday.getDate();
        birthday = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
        email = customer.email;
        gender = customer.gender;
        address = customer.address;
        avatar = customer.avatar;
        console.log(avatar);

        res.render('editprofilepage', {fullname, birthday, email, gender, address, avatar, user:account, role: role });    
    }

    async profileUpload(req, res, next) {
        let username;
        let role;
        const token = req.cookies.token;

        // Lấy token từ cookie
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
        });
        
        const account = await Account.findAccount(username);
        if (!account) {
            res.clearCookie('token');
            return res.redirect('/');
        }

        const { fullname, birthday, email, gender, address } = req.body;
        if (!req.file) {
            await db.update('Customer', 'fullname', fullname, 'customer_id', account.ID);
            await db.update('Customer', 'dob', birthday, 'customer_id', account.ID);
            await db.update('Customer', 'email', email, 'customer_id', account.ID);
            await db.update('Customer', 'gender', gender, 'customer_id', account.ID); 
            await db.update('Customer', 'address', address, 'customer_id', account.ID);
        
            res.redirect('/profile');
        }
        else {
            let avatarPath = req.file.path; 
            const avatarPathWithForwardSlash = avatarPath.replace(/\\/g, '/');
            const relativePath = '/' + avatarPathWithForwardSlash.split('public/')[1];
            console.log(relativePath);

            await db.update('Customer', 'fullname', fullname, 'customer_id', account.ID);
            await db.update('Customer', 'dob', birthday, 'customer_id', account.ID);
            await db.update('Customer', 'email', email, 'customer_id', account.ID);
            await db.update('Customer', 'gender', gender, 'customer_id', account.ID); 
            await db.update('Customer', 'address', address, 'customer_id', account.ID);
            await db.update('Customer', 'avatar', relativePath, 'customer_id', account.ID);

            res.redirect('/profile');
        }
    }
}

module.exports = new HomeController;