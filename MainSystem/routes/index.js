const homeRouter = require('./home');
const categoryRouter = require('./category');
const bookRouter=require('./book')
const accRouter = require('./account.r')

function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
    app.use('/book',bookRouter);
    app.use('/account', accRouter);
}

module.exports=route;