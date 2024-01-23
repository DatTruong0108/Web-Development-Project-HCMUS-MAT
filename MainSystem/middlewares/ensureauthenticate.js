const jwt=require('jsonwebtoken');

module.exports=async function AuthenticateMiddleware(req,res,next){   
      if (req.cookies.token){
        return res.redirect('/');
      }

    next();
}