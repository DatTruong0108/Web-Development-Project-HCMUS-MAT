require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const { engine } = require('express-handlebars');
const methodOverride = require("method-override");
const cors = require('cors');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const bcryptH = require('./helpers/bcrypt.h');

const https = require('https');
const bodyparser = require("body-parser");

const app = express();
const port = process.env.SUB_PORT || 3113;

const db = require('../MainSystem/utils/db');
const Account = require('../MainSystem/models/account.m');
const payAccount = require('./models/payAccount')
const Order = require('../MainSystem/models/Order');
const OrderHistory = require('../MainSystem/models/OrderHistory');
const Book = require('../MainSystem/models/Book');

const fs = require('fs');
//const route=require("./routes");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.use('/public/Images', express.static(__dirname + '/public/Images'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      section: function (name, options) {
        if (!this._sections) { this._sections = {} };
        this._sections[name] = options.fn(this);
        return null;
      },
      ifEquals: function (a, opts) {
        if (parseInt(a) % 5 == 0) {
          return opts.fn(this);
        }
        return opts.inverse(this);
      },
      ifEqual: function (a, opts) {
        if (parseInt(a) % 5 == 4) {
          return opts.fn(this);
        }
        return opts.inverse(this);
      },
      ifE: function (a, b, opts) {
        if (a.toString() == b.toString()) {
          return opts.fn(this);
        }
        return opts.inverse(this);
      },
    }
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const session = require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

//route(app);
const cookieParser = require("cookie-parser");
app.use(cookieParser());

var cookieExtractor = function (req) {
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

const Handlebars = require('handlebars');

Handlebars.registerHelper('formatDate', function (date) {
  let formattedDate;
  if (date) {
    formattedDate = new Date(date).toLocaleDateString('en-GB');
  } else {
    formattedDate = '';
  }

  return formattedDate;
});

Handlebars.registerHelper('getPriceQuantity', function (prices, quantities) {
  let result = '';

  if (prices && quantities && prices.length === quantities.length) {
    for (let i = 0; i < prices.length; i++) {
      result += `${prices[i]} x ${quantities[i]}`;
      if (i < prices.length - 1) {
        result += '<br>';
      }
    }
  }

  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('addOne', function (index) {
  return index + 1;
})

app.use(passport.initialize());

app.get('/home', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const account = await payAccount.get('id', req.user.ID);
  if (account) {
    res.render('home', { username: req.user.username, account: account })
  }
});
// Route để đảm bảo người dùng đã xác thực
app.get('/authenticate', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const account = await payAccount.get('id', req.user.ID);
  if (!account) {
    res.render('createAcc', { username: req.user.username })
  }
  else {
    res.cookie('user', req.user.ID, { maxAge: 86400000, httpOnly: true });
    res.render('check')
  }
});

app.get('/authenticate-payment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const account = await payAccount.get('id', req.user.ID);
  if (!account) {
    res.render('createAcc', { username: req.user.username })
  }
  else {
    res.cookie('user', req.user.ID, { maxAge: 86400000, httpOnly: true });
    res.render('checkpayment');
  }
});

app.get('/back', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Kiểm tra xác thực thành công, sau đó chuyển hướng đến Server 2
  res.redirect('https://localhost:3000/');
});

app.post('/check', async (req, res) => {
  try {
    const id = parseInt(req.cookies.user);
    const { pin } = req.body;
    const account = await payAccount.get('id', id);
    console.log(account.pin);
    const isValidPassword = await bcryptH.check(pin.toString(), account.pin);
    if (isValidPassword) {
      res.status(200).json({ success: true, isValid: true });
    }
    else res.status(200).json({ success: true, isValid: false });
  } catch {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }

});

app.post('/check-payment', async (req, res) => {
  try {
    const id = parseInt(req.cookies.user);
    const { pin } = req.body;
    const account = await payAccount.get('id', id);
    console.log(account.pin);
    const isValidPassword = await bcryptH.check(pin.toString(), account.pin);
    if (isValidPassword) {
      res.status(200).json({ success: true, isValid: true });
    }
    else res.status(200).json({ success: true, isValid: false });
  } catch {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }

});

app.post('/create-account', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { pin } = req.body;

  try {
    // Giải mã token để trích xuất thông tin người dùng
    const pws = await bcryptH.hashPassword(pin);

    const newAcc = new payAccount({
      id: parseInt(req.user.ID),
      balance: parseFloat(0),
      pin: pws.toString()
    });

    const rs = await Account.addPayAccount(newAcc);
    console.log(rs);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/payment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // console.log("go to payment");
    // console.log(req.user.ID);

    let username;
    let role;
    const token = req.cookies.token;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token không hợp lệ.' });
      }
      else {
        username = decoded.username;
        role = decoded.role;
      }
    });

    const account = await payAccount.get('id', req.user.ID);
    if (!account) {
      res.clearCookie('token');
      return res.redirect('/home');
    }

    console.log(account.id);

    const list = await Order.findListOrder(account.id);

    // Tạo 1 listOrder mới
    let listOrder = [];

    for (const order of list) {
      if (order.status === 'pending') {
        // lọc id sách tồn tại
        const existingBookIds = [];

        for (const itemId of order.listItems) {
          const book = await Book.get("id", itemId);
          if (book !== null) {
            existingBookIds.push(itemId);
          }
        }

        // Kiểm tra nếu có sách tồn tại thì thêm vào listOrder 
        if (existingBookIds.length > 0) {
          // Tạo các mảng để lưu thông tin của từng sách trong order
          let listNames = [];
          let listPrices = [];
          let listQuantity = [];

          // Lặp qua từng itemId trong existingBookIds để lấy thông tin và thêm vào các mảng
          for (const itemId of existingBookIds) {
            const book = await Book.get("id", itemId);

            if (book !== null) {
              listNames.push(book.name);
              listPrices.push(book.price);
              listQuantity.push(order.listQuantity[order.listItems.indexOf(itemId)]);
            }
          }

          const filteredOrder = new OrderHistory({
            id: order.id,
            listNames: listNames,
            listPrices: listPrices,
            listQuantity: listQuantity,
            userID: order.userID,
            status: order.status,
            subTotal: order.subTotal,
            shippingFee: order.shippingFee,
            date: order.date,
            total: order.total
          });
          // console.log(filteredOrder.id);
          listOrder.push(filteredOrder);
        }
      }
    }

    // Sắp xếp listOrder theo thứ tự giảm dần của date
    listOrder.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return res.render('payment', {
      listOrder: listOrder,
      username: username,
      account: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error in get payment.' });
  }
});

app.post('/payment', async (req, res) => {
  try {
    const order_id = parseInt(req.body.order_id);
    const total = parseFloat(req.body.total);

    const id = parseInt(req.cookies.user);
    let account = await payAccount.get('id', id);
    const rs = await payAccount.updateBalance(account.balance - total, id);
    account = await payAccount.get('id', id);

    const order = await Order.getByID(order_id);
    if (order === null) {
      return res.status(400).json({ error: 'Không tìm thấy đơn hàng.' });
    }

    const rs1 = await Order.updateStatus(order_id, "paid");

    // Trả về kết quả thành công
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error in post payment.' });
  }
});

app.post('/addBalance', async (req, res) => {
  try {
    // Lấy số tiền từ yêu cầu POST
    const balanceAmount = parseFloat(req.body.balanceAmount);

    const id = parseInt(req.cookies.user);
    let account = await payAccount.get('id', id);
    const rs = await payAccount.updateBalance(balanceAmount + account.balance, id);
    account = await payAccount.get('id', id);

    // Trả về kết quả thành công
    res.status(200).json({ success: true, newBalance: account.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
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
  console.log(`Sub server listening on port ${port}`));