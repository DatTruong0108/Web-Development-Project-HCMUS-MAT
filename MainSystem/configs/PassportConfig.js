const passport = require('passport');
const LocalStrategy = require('passport-local');
const Account = require('../models/account.m')
const bcryptH = require('../helpers/bcrypt.h');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.username);
});
passport.deserializeUser(async (username, done) => {
    const user = await Account.findAccount(username);
    if (user == undefined) {
        done('auth err!');
        return;
    }
    done(null, user)
});

const configPassport = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(async (username, password, done) => {
        const user = await Account.findAccount(username);
        if (!user) {
          return done(null, false, { message: 'Invalid username' });
        }
        const isValidPassword = await bcryptH.check(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid password' });
        }
        done(null, user);
      }));
}

module.exports = configPassport;