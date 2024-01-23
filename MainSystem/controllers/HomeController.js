const db = require('../utils/db')
const Book = require('../models/Book')
const Account= require('../models/account.m');
const { use } = require('passport');
const jwt = require('jsonwebtoken')
const Category=require('../models/Category')


class HomeController {
    async index(req, res, next) {
        const latestRelease = await Book.getLatestRelease();
        const bestSelling = await Book.getBestSelling();
        
        let username;
        let role;
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
            res.render('homepage', { bestSelling: bestSelling, latestRelease: latestRelease,user:account, role: role });    
        }
        else{          
            res.render('homepage', { bestSelling: bestSelling, latestRelease: latestRelease});
        }
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

        let fullname, birthday, email, gender, address, avatar
        const customer = await Account.findCustomer(account.ID);
        fullname = customer.fullname;
        birthday = new Date(customer.dob);
        var year = birthday.getFullYear();
        var month = birthday.getMonth() + 1; 
        var day = birthday.getDate();
        birthday = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
        email = customer.email;
        gender = customer.gender;
        address = customer.address;
        avatar = customer.avatar;

        res.render('profilepage', {fullname, birthday, email, gender, address, avatar, user:account, role: role });    
    }
}

module.exports = new HomeController;