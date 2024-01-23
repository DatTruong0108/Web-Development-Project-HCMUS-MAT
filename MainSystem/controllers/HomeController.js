const db = require('../utils/db')
const Book = require('../models/Book')
const Account= require('../models/account.m');
const { use } = require('passport');
const jwt = require('jsonwebtoken')

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
}

module.exports = new HomeController;