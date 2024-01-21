const app = require("express");
const User = require('../controllers/user.c')
const router = app.Router();

router.get('/account',User.getProfile);

module.exports = router;
