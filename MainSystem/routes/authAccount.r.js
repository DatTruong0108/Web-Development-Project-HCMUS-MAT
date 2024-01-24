const app = require("express");
const router = app.Router();
require('dotenv').config();
const passport = require ('passport');
const accountController = require('../controllers/authAccount.c');
router.get('/google',
  passport.authenticate('google', { scope:  ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/account/login' }),
  accountController.getPassport);

router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/account/login' }),
  accountController.getPassport);
  module.exports = router;
