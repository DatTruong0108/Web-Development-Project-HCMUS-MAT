const homeRouter = require('./home');
const categoryRouter = require('./category');
const bookRouter=require('./book');
const adminRouter=require('./admin')
const cartRouter = require('./cart');
const accRouter = require('./account.r')
const authRouter = require('./authAccount.r');
const userManagementRouter = require('./userManagement.r');
const orderManagement = require('./orderManagement.r');
const couponManagement = require('./couponManagement.r');


function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
    app.use('/book',bookRouter);
    app.use('/admin',adminRouter);
    app.use('/cart', cartRouter);
    app.use('/account/auth', authRouter);
    app.use('/account', accRouter);
    app.use('/user-management',userManagementRouter);
    app.use('/order-management', orderManagement);
    app.use('/coupon-management', couponManagement);
}

module.exports=route;
