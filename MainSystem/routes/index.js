const homeRouter = require('./home');
const categoryRouter = require('./category');
const bookRouter=require('./book')

function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
    app.use('/book',bookRouter);
}

module.exports=route;