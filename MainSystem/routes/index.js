const homeRouter = require('./home');
const categoryRouter = require('./category');

function route(app){
    app.use('/',homeRouter);
    app.use('/category', categoryRouter);
}

module.exports=route;