const hbs = require('express-handlebars');
const path = require('path');

function handlebars(app) {
    app.engine('hbs', hbs.engine({
        extname: "hbs",
        layoutsDir: path.join(__dirname, "../views", "layouts"),
        partialsDir: path.join(__dirname, "../views", "partials"),
        defaultLayout: "home",
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));
}

module.exports = handlebars;