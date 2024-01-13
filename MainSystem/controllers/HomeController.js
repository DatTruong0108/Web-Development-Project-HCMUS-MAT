const db=require('../utils/db')


class HomeController{
    async index(req,res,next){ 
        const rs=await db.getAll();   
        console.log(rs);
        res.render('homepage');
    }
}

module.exports=new HomeController;