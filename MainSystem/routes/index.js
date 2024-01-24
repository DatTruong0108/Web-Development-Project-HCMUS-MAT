const homeRouter = require('./home');
const categoryRouter = require('./category');
const bookRouter=require('./book');
const adminRouter=require('./admin')
const cartRouter = require('./cart');
const accRouter = require('./account.r')
const authRouter = require('./authAccount.r');

function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
    app.use('/book',bookRouter);
    app.use('/admin',adminRouter);
    app.use('/cart', cartRouter);
    app.use('/account/auth', authRouter);
    app.use('/account', accRouter);
    
}

module.exports=route;
