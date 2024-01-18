const db=require('../utils/db')
const Movie=require('../models/Book')


class HomeController{
    async index(req,res,next){ 
        const latestRelease=await Movie.getLatestRelease();
        const bestSelling=await Movie.getBestSelling();
        res.render('homepage',{bestSelling: bestSelling,latestRelease:latestRelease});
    }
}

module.exports=new HomeController;