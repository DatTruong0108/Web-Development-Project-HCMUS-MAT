require ('dotenv').config();
const path=require('path');
const morgan=require('morgan');
const express=require ('express');
const {engine}=require('express-handlebars');
const methodOverride=require("method-override");
const cors = require('cors');
const jwt = require('jsonwebtoken');

const https=require('https');
const bodyparser = require("body-parser");

const app=express();
const port=process.env.SUB_PORT || 3113;

const db=require('../MainSystem/utils/db');
const Account=require('../MainSystem/models/account.m');
const payAccount=require('./models/payAccount')

const fs = require('fs');
//const route=require("./routes");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.use('/public/Images',express.static(__dirname+'/public/Images'));
app.use('/public/js',express.static(__dirname+'/public/js'));
app.use('/public/css',express.static(__dirname+'/public/css'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers:{
            sum: (a,b)=>a+b,
            section:function(name, options){
                if(!this._sections){this._sections = {}};
                this._sections[name] = options.fn(this);
                return null;
            },
            ifEquals: function (a, opts) {
                if (parseInt(a)%5==0) {
                  return opts.fn(this);
                }
                return opts.inverse(this);
              },
            ifEqual: function (a, opts) {
                if (parseInt(a)%5==4) {
                  return opts.fn(this);
                }
                return opts.inverse(this);
              },
            ifE: function (a,b, opts) {
                if (a.toString()==b.toString()) {
                  return opts.fn(this);
                }
                return opts.inverse(this);
            },
        }
    })
);

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));

const session=require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));



//route(app);
const cookieParser=require("cookie-parser");
app.use(cookieParser());

app.post('/create-account', async (req, res) => {
  const {token} = req.body;
  
  try {
    // Giải mã token để trích xuất thông tin người dùng
     let userId;
     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: "Token không hợp lệ." });
      } else {
          userId = decoded.sub;
      }
    });
    
    const newAcc=new payAccount({
      id:parseInt(userId),
      balance:parseFloat(0),
    });

    const rs=await Account.addPayAccount(newAcc);
    console.log(rs);

    res.json({ message: 'Account created successfully' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      // Lỗi khi giải mã token
      res.status(401).json({ error: 'Invalid token' });
    } else {
      // Các lỗi khác
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get("/",(req,res,next)=>{
  res.render('home');
})

const credentials = {
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERTIFICATE,
};

app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message);
  });

var server = https.createServer(credentials, app);
server.listen(port, () =>
  console.log(`Sub server listening on port ${port}`));