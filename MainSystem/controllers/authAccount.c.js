const Account = require('../models/account.m');
const bcryptH = require('../helpers/bcrypt.h');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const passport = require ('passport');

module.exports = {
    getPassport: async (req, res, next) => {
        req.logIn(req.user,async function(err) {
            if (err) {
              return res.redirect('/account/signin');
            }
            console.log(req.user);
            const admin = await Account.findAdmin(req.user.ID);
            const us=  await Account.findCustomer(req.user.ID);
            var token;
            if (admin){
                 token = jwt.sign({ username: req.user.username,role:"admin" }, process.env.SECRET_KEY,{expiresIn: 86400000});
            }
            else if (us) {
                 token = jwt.sign({ username: req.user.username,role:"user" }, process.env.SECRET_KEY,{expiresIn: 86400000});
            }
           
            res.cookie('token', token, { maxAge: 86400000, httpOnly: true }); // Set maxAge in milliseconds
            return res.redirect('/');
          });
    },
}