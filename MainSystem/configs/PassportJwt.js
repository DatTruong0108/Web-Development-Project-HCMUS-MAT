require ('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  };

const PassportJwt=(app) =>{
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
          const user = jwt_payload.sub;
      
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
      );
}

module.exports=PassportJwt;
  
  
  