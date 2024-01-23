const homeRouter = require('./home');
const categoryRouter = require('./category');
const bookRouter=require('./book');
const adminRouter=require('./admin')


function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
    app.use('/book',bookRouter);
    app.use('/admin',adminRouter);
}

module.exports=route;