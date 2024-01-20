const db=require('../utils/db')
const Book=require('../models/Book')


class HomeController{
    async index(req,res,next){ 

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