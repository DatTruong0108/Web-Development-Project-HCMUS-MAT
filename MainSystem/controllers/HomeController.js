const db=require('../utils/db')
const Book=require('../models/Book')


class HomeController{
    async index(req,res,next){ 
        const token = req.cookies.token; // Lấy token từ cookie
            let username;
            if (!token) {
                return res.redirect('/account/signin');
            }
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token không hợp lệ." });
                } else {
                    username = decoded.username;
                }
            });
            const account = await Account.findAccount(username);
            if(!account){
                req.logout(function(err) {
                    if (err) {
                      // Handle error
                      console.error(err);
                      return res.json({ success: false, message: "Error logging out" });
                    }
                    res.clearCookie('token');
                    return res.redirect('/');
                });
            }
            var user = await Account.findAdmin(account.ID);
            if(user){
                return res.render('empty', {role:"admin"});
            }
            
            user = await Account.findCustomer(account.ID);
        const latestRelease=await Book.getLatestRelease();
        const bestSelling=await Book.getBestSelling();
        res.render('homepage',{bestSelling: bestSelling,latestRelease:latestRelease});
    }
    
    // async search(req,res,next){
    //     const key=req.body.key;
    //     const rs=await Book.searchBook(key);
    //     if (rs){
    //         res.send(rs);
    //     }
    //     else{
    //         res.send("Error");
    //     }
        
    // }


}

module.exports=new HomeController;