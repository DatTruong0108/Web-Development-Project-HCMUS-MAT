const Account = require('../models/account.m');
const bcryptH = require('../helpers/bcrypt.h');
const jwt = require('jsonwebtoken');
const axios=require('axios')
require('dotenv').config();
const passport = require ('passport');
const { token } = require('morgan');

module.exports = {
    getLogin: (req, res, next) => {
        res.render('signin')
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
                let token;
                if(addId)
                {   
                    const userId = addId; // Thay đổi thành ID của người dùng mới được tạo
                    token = jwt.sign({ sub: userId }, process.env.SECRET_KEY,{expiresIn: 86400000});
                    await Account.addCustomer(signUpData, addId);

                }
                else return res.json ({ isValid:false, message: 'cant add account to database' });
                res.json({ isValid: true,token:token});
            } else {
                res.json({ isValid:false, message: 'username has exist' });
            }
        } catch (error) {
            next(error);
        };
    },
    postPassport: (req,res, next) => {
        passport.authenticate('local', async function(err, user, info) {
          if (err) {
            return res.json({ isValid: false, message: "Lỗi hệ thống" });
          }
          if (!user) {
            return res.json({ isValid: false, message: info.message });
          }
          req.logIn(user,async function(err) {
            if (err) {
              return res.json({ isValid: false, message: "Lỗi hệ thống khi đăng nhập" });
            }
            console.log(user);
            const admin = await Account.findAdmin(user.ID);
            const us=  await Account.findCustomer(user.ID);
            var token;
            if (admin){
                 token = jwt.sign({ username: user.username,role:"admin" }, process.env.SECRET_KEY,{expiresIn: 86400000});
            }
            else if (us) {
                 token = jwt.sign({ username: user.username,role:"user" }, process.env.SECRET_KEY,{expiresIn: 86400000});
            }
           
            res.cookie('token', token, { maxAge: 86400000, httpOnly: true }); // Set maxAge in milliseconds
            return res.json({
              isValid: true,
              message: "Đăng nhập thành công",
            });
          });
        })(req, res);
      },

    getSignOut: async (req, res, next) =>{
        if (req.cookies.token){
            res.clearCookie('token');
            res.redirect('/');
        }
        else{
            res.redirect('/');
        }
    }
}