const db=require('../utils/db')


class HomeController{
    async index(req,res,next){ 
        res.render('homepage');
    }
}

module.exports=new HomeController;