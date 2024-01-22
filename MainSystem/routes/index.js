const homeRouter = require('./home');
const categoryRouter = require('./category');
const bookRouter=require('./book')
<<<<<<< HEAD
const cartRouter = require('./cart');
=======
const accRouter = require('./account.r')
>>>>>>> 25945f51fcb7525a31d817bfaca596cddf56ba16

function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
    app.use('/book',bookRouter);
<<<<<<< HEAD
    app.use('/cart', cartRouter);
=======
    app.use('/account', accRouter);
>>>>>>> 25945f51fcb7525a31d817bfaca596cddf56ba16
}

module.exports=route;