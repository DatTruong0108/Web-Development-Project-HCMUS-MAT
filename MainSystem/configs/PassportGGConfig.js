const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Account = require('../models/account.m')
const bcryptH = require('../helpers/bcrypt.h');
require('dotenv').config();

const configPassportGoogle = (app) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  }, 
  async (accessToken, refreshToken, profile, done) => {
    if(!profile) return done("Error login", null);
    if(!profile._json) return done ("Error login", null);
    var user = await Account.findAccount(profile._json.sub);
    if(user) return done(null, user);
    const signUpData = {
      fullname: profile._json.name,
      username: profile._json.sub,
      password: "google",
      email: profile._json.email,
      address: null,
      dob: null,
      gender: null,
      avatar: profile._json.picture,  
  };
    const addId = await Account.addAccount(signUpData);
    if(addId) await Account.addCustomer(signUpData, addId);
    else return done ('cant add account to database', null);
    user = await Account.findAccount(profile._json.sub);
    if(!user){
      return done("Error login", null);
    }
    return done(null, user);
  }
));
}

module.exports = configPassportGoogle;