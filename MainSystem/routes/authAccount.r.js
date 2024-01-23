const app = require("express");
const router = app.Router();
require('dotenv').config();
const passport = require ('passport');
const accountController = require('../controllers/authAccount.c');
router.get('/google',
  passport.authenticate('google', { scope:  ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/account/login' }),
  accountController.passportGoogle);

  module.exports = router;
