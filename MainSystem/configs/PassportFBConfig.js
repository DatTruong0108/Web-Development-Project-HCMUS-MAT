const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Account = require('../models/account.m')
const bcryptH = require('../helpers/bcrypt.h');
require('dotenv').config();

const configPassportGoogle = (app) => {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'displayName', 'photos', 'email'] ,
  }, 
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile._json.picture.data);
    if(!profile) return done("Error login", null);
    if(!profile._json) return done ("Error login", null);
    var user = await Account.findAccount("FB" + profile._json.id);
    if(user) return done(null, user);
    const signUpData = {
      fullname: profile._json.name,
      username: "FB" + profile._json.id,
      password: "facebook",
      email: null,
      address: null,
      dob: null,
      gender: null,
      avatar: profile._json.picture.data.url,  
    };
    const addId = await Account.addAccount(signUpData);
    if(addId) await Account.addCustomer(signUpData, addId);
    else return done ('cant add account to database', null);
    user = await Account.findAccount("FB" + profile._json.id);
    if(!user){
      return done("Error login", null);
    }
    return done(null, user);
  }
));
}

module.exports = configPassportGoogle;