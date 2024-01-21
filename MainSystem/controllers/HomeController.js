const db=require('../utils/db')
const Book=require('../models/Book')


class HomeController{
    async index(req,res,next){ 

        const latestRelease=await Book.getLatestRelease();
        const bestSelling=await Book.getBestSelling();
        res.render('homepage',{bestSelling: bestSelling,latestRelease:latestRelease});
    }


}

module.exports=new HomeController;