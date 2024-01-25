const express=require('express');
const route=express.Router();
const multer = require('multer');
const fs = require('fs');
const Account= require('../models/account.m');
const jwt = require('jsonwebtoken')
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        let username;
        const token = req.cookies.token;

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
            }
        });
        const account = await Account.findAccount(username);
        if (!account) {
            res.clearCookie('token');
            return res.redirect('/');
        }

        const destinationFolder = `MainSystem/public/Images/Customers/${account.ID}`;
  
        fs.mkdir(destinationFolder, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
            cb(err, null);
          } else {
            cb(null, destinationFolder);
          }
        });
      } catch (error) {
        console.error(error);
        cb(error, null);
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
  
const uploadImg = multer({ storage: storage });

const cookieParser = require("cookie-parser");

route.use(cookieParser());

const HomeController=require('../controllers/HomeController');
const isAuthenticated=require('../middlewares/authenticate')

route.get('/profile',isAuthenticated,HomeController.profile);

route.get('/orderHistory', HomeController.orderHistory);

//route.post('/search',HomeController.index);
route.get('/orderHistory', HomeController.orderHistory);
route.get('/profile',HomeController.profile);
//route.post('/search',HomeController.index);
route.get('/orderHistory', HomeController.orderHistory);
route.get('/profile',HomeController.profile);
route.get('/',HomeController.index);

route.post('/profile/edit',HomeController.profileEdit);
route.post('/profile/upload', uploadImg.single('avatar'), (req, res, next) => {
    console.log("File uploaded successfully");
    next();
}, HomeController.profileUpload);


module.exports=route;