const jwt = require('jsonwebtoken');
const Account=require('../models/account.m')

module.exports = async function AuthenticateMiddleware(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect('/account/signin');
    }

    const token = req.cookies.token;
    let username;
    let role;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token không hợp lệ." });
        } else {
            username = decoded.username;
            role=decoded.role;
        }
    });
    
    const account = await Account.findAccount(username);
    req.user=account;
    req.role=role;

    next();
};