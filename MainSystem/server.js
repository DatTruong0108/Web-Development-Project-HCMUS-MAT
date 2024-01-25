require ('dotenv').config();
const path=require('path');
const morgan=require('morgan');
const express=require ('express');
const {engine}=require('express-handlebars');
const methodOverride=require("method-override");

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cors = require('cors');

const https=require('https');
const bodyparser = require("body-parser");

const app=express();
const port=process.env.MAIN_PORT || 3000;

const db=require('./utils/db');
const Account=require('./models/account.m')
const fs = require('fs');
const route=require("./routes");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

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
            currentPage: function () {
              return this.currentPage;
            },
            subtractOne: function (value) {
              const page = value;
              const pageNumber = parseInt(page.split('=')[1], 10);
              if (pageNumber === 1) {
                  return value;
              }
              const prePage = pageNumber - 1;
              const rs = 'page=' + prePage;
              return rs;
          },
      
          addinOne: function (value, totalPages) {
              const page = value;
              const pageNumber = parseInt(page.split('=')[1], 10);
              if (pageNumber === totalPages) {
                  return value;
              }
              const nextPage = pageNumber + 1;
              const rs = 'page=' + nextPage;
              return rs;
          },
      
          range: function (start, end) {
              const result = [];
              for (let i = start; i <= end; i++) {
                  result.push(i); 
              }
              return result;
          },
      
          eq: function (a, b) {
              return a === b;
          },

          priceRangeLabel: function (priceRange) {
            switch (priceRange) {
              case '0' || 0:
                return 'All';
              case '1' || 1:
                return '0 - 10.00';
              case '2' || 2:
                return '10.00 - 20.00';
              case '3' || 3:
                return '20.00 - 30.00';
              case '4' || 4:
                return '30.00 - 40.00';
              case '5' || 5:
                return 'More than 40.00';
              default:
                return 'Price Range';
            }
          }
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

route(app);

const cookieParser=require("cookie-parser");
app.use(cookieParser());

const passportConfig = require('./configs/PassportConfig');
passportConfig(app);
const passportGoogle = require('./configs/PassportGGConfig');
passportGoogle(app);
const passportFacebook = require('./configs/PassportFBConfig');
passportFacebook(app);
// const passportJwt = require('./configs/PassportJwt');
// passportJwt(app);

app.use(cors());

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['token'];
  }
  return token;
};


const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
   
    // Truy vấn người dùng từ payload.sub (ID người dùng) và kiểm tra người dùng
    // Done(err, user) sẽ trả về user nếu tìm thấy, ngược lại trả về false
    // Thay thế phần này với logic truy vấn người dùng từ database của bạn
    const user = await Account.findAccount(payload.username);
    
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
);

app.use(passport.initialize());

const authenticate = passport.authenticate('jwt', { session: false });

// Route để chuyển hướng sang Server 2
app.get('/smartpay', authenticate, (req, res) => {
  console.log("kff");
  // Kiểm tra xác thực thành công, sau đó chuyển hướng đến Server 2
  res.redirect('https://localhost:3113/authenticate');
});

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
  console.log(`Main server listening on port ${port}`));