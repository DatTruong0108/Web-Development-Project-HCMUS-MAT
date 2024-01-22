const Account = require('../models/account.m');
const bcryptH = require('../helpers/bcrypt.h');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const passport = require ('passport');
module.exports = {
    getLogin: async (req, res, next) => {
        try {
            const token = req.cookies.token; // Lấy token từ cookie
            if (token) {
                return res.redirect('/');
            }
            res.render('signin');
        } catch (error) {
            return new Error('Error get login');
        };
    },

    home: async (req, res, next) => {
        try {
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
            const account = await Account.findAccount(username);
            if(!account){
                req.logout(function(err) {
                    if (err) {
                      // Handle error
                      console.error(err);
                      return res.json({ success: false, message: "Error logging out" });
                    }
                    res.clearCookie('token');
                    return res.redirect('/');
                });
            }
            var user = await Account.findAdmin(account.ID);
            if(user){
                return res.render('empty', {role:"admin"});
            }
            
            user = await Account.findCustomer(account.ID);
            return res.render('empty', {role:"customer"});
        } catch (error) {
            return new Error('Error get login');
        };
    },

    getSignup: async (req, res, next) => {
        try {
            const token = req.cookies.token; // Lấy token từ cookie
            if (token) {
                return res.redirect('/');
            }
            res.render('signup');
        } catch (error) {
            return new Error('Error get signup');
        };

    },

    postSignup: async (req, res, next) => {
        try {
            let addRs = false;
            const signUpData = {
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                address: req.body.address,
                dob: req.body.dob,
                gender: req.body.gender,
                avatar: 'https://i.imgur.com/iaFsx2r.jpg'  
            };
            const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
            if (!signUpData.fullname || !signUpData.username || !signUpData.password || !signUpData.email || !signUpData.dob || !signUpData.gender) {
                res.json({ isValid: false, message: 'Please fill in all fields' });
                return;
            }
            if (!usernameRegex.test(signUpData.username)) {
                res.json({ isValid: false, message: 'Username must start with a letter and can only contain letters and numbers'});
                return;
            }
            let checkUser = await Account.findAccount(signUpData.username);
            if (checkUser == undefined) {
                signUpData.password = await bcryptH.hashPassword(signUpData.password);
                addId = await Account.addAccount(signUpData);
                if(addId) await Account.addCustomer(signUpData, addId);
                else return res.json ({ isValid:false, message: 'cant add account to database' });
                res.json({ isValid: true });
            } else {
                res.json({ isValid:false, message: 'username has exist' });
            }
        } catch (error) {
            next(error);
        };
    },
    postSignin: async (req, res, next) => {
        try{
            // const { username, password } = req.body;
            // const user= await Account.findUser(username);
            // if (!user){
            //     return res.json({ isValid: false, message: "Tên đăng nhập không tồn tại." });
            // }
            // let isPasswordValid =await bcryptH.check(password, user.password);
            // if (!isPasswordValid) {
            // return res.json({ isValid: false, message: "Mật khẩu không chính xác." });
            // }
            console.log("===");
            const user = req.user;
            const token_auth=jwt.sign({username:user.username},process.env.SECRET_KEY, { expiresIn: 600});
            //res.cookie('token',token_auth,{maxAge:60000, httpOnly:true });
            return res.json({
                isValid: true, 
                message: "thanh cong",
                token: undefined,
            })
        }
        catch (error){
            next(error);
        }
    },
    postPassport: (req,res, next) => {
        passport.authenticate('local', async function(err, user, info) {
          if (err) {
            return res.json({ isValid: false, message: "Lỗi hệ thống" });
          }
          if (!user) {
            return res.json({ isValid: false, message: info.message });
          }
          req.logIn(user, function(err) {
            if (err) {
              return res.json({ isValid: false, message: "Lỗi hệ thống khi đăng nhập" });
            }
            const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: 600 });
            res.cookie('token', token, { maxAge: 600000, httpOnly: true }); // Set maxAge in milliseconds
            return res.json({
              isValid: true,
              message: "Đăng nhập thành công",
            });
          });
        })(req, res);
      },
    getSignOut: async (req, res, next) =>{
        req.logout(function(err) {
            if (err) {
              // Handle error
              console.error(err);
              return res.json({ success: false, message: "Error logging out" });
            }
            res.clearCookie('token');
            return res.redirect('/account/signin');
        });
    }
}