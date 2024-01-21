const { error } = require('console');
const User = require('../models/account.m');
const jwt=require('jsonwebtoken');
const path = require('path');
const publicDir = path.join(__dirname, 'public');

module.exports = {
    getProfile: async (req, res, next) => {
        try{
            const token = req.cookies.token; // Lấy token từ cookie
            let username;
            if (!token) {
                return res.redirect('/signin');
            }
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token không hợp lệ." });
                } else {
                    username = decoded.username;
                }
            });
            const account = await User.findAccount(username);
            if(!account){
                req.logout(function(err) {
                    if (err) {
                      // Handle error
                      console.error(err);
                      return res.json({ success: false, message: "Error logging out" });
                    }
                    res.clearCookie('token');
                return res.redirect('/signin');
                });
            }
            var user = await User.findAdmin(account.ID);
            if(!user){
                user = await User.findCustomer(account.ID);
            }
            if(!user){
                req.logout(function(err) {
                    if (err) {
                      // Handle error
                      console.error(err);
                      return res.json({ success: false, message: "Error logging out" });
                    }
                    res.clearCookie('token');
                    return res.redirect('/signin');
                });
            }
            res.render('infor',user);
        }
        catch(error){
            console.log(error);
        }
        
    },
    
}