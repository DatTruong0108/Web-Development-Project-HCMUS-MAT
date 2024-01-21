function errorHandler(err, req, res, next) {
    if (err) {
        console.log('mdw');
        return res.redirect('/signin');
        res.json({ isValid: false, message: err.message});
    }
}
  
module.exports = errorHandler;
  