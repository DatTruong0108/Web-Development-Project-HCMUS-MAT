require ('dotenv').config();
const path=require('path');
const morgan=require('morgan');
const express=require ('express');
const {engine}=require('express-handlebars');
const methodOverride=require("method-override");

const https=require('https');
const bodyparser = require("body-parser");

const app=express();
const port=process.env.MAIN_PORT || 3000;

const db=require('./utils/db');
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
  console.log(`Auth server listening on port ${port}`));