const db = require('../utils/db')
const Book = require('../models/Book')
const Category=require('../models/Category')

class HomeController {
    async index(req, res, next) {
        // const token = req.cookies.token; // Lấy token từ cookie
        // let username;
        // if (!token) {
        //     return res.redirect('/account/signin');
        // }
        // jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        //     if (err) {
        //         return res.status(401).json({ message: "Token không hợp lệ." });
        //     } else {
        //         username = decoded.username;
        //     }
        // });
        // const account = await Account.findAccount(username);
        // if (!account) {
        //     req.logout(function (err) {
        //         if (err) {
        //             // Handle error
        //             console.error(err);
        //             return res.json({ success: false, message: "Error logging out" });
        //         }
        //         res.clearCookie('token');
        //         return res.redirect('/');
        //     });
        // }
        // var user = await Account.findAdmin(account.ID);
        // if (user) {
        //     return res.render('empty', { role: "admin" });
        // }

        // user = await Account.findCustomer(account.ID);
        const latestRelease = await Book.getLatestRelease();
        const bestSelling = await Book.getBestSelling();
        res.render('homepage', { bestSelling: bestSelling, latestRelease: latestRelease });
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

    async profile(req, res, next) {
        res.render('profilepage');
    }



    /* Admin CRU Category*/
    async adminCate(req,res,next){ 
        const categories=await Category.getAll();
        
        res.render('admincategorypage',{categories});
    }

    async adminAddCatePage(req,res,next){         
        res.render('adminaddcategorypage');
    }

    async adminAddCategory(req,res,next){ 
        try {
            const {name} = req.body;
            const cateNew = name;
            const existingCategoryId = await Category.getCatIDByName(cateNew);

            if (existingCategoryId) {
                //Nếu đã tồn tại tên này thì không thêm
                res.status(400).json({ error: 'Category with this name already exists' });
                return;
            }

            const newCategory = await Category.insert(cateNew );
            res.redirect('/admin/category');
        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async adminDeleteCate(req,res,next){ 
        const {id} = req.params;

        try {
            const rs = await Category.deleteCateByID(id);
           
            if(rs) {
                res.redirect('/admin/category');
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async adminEditCategory(req,res,next){ 
        const {name} = req.body;
        const cateName = name;
        const {id} = req.params;

        try {
            const rs = await Category.editCateByID(cateName, id);
           
            if(rs) {
                res.redirect('/admin/category');
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async adminEditCatePage(req,res,next){ 
        const {id} = req.query;
        const cateName = await Category.getCatNameByID(id);

        res.render('admineditcategorypage', {id, cateName});
    } 

}

module.exports = new HomeController;