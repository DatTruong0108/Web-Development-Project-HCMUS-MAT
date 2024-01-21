const session = require('express-session')
require('dotenv').config();

const configSession = (app) => {
    app.use(session(
        {
            secret: process.env.SECRET_KEY,
            resave: true,
            saveUninitialized: true,
            cookie: { secure: false }
    }))
}

module.exports = configSession;