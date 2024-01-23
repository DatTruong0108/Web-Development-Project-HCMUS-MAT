const db=require('../utils/db')
const Book=require('../models/Book')
const Category=require('../models/Category')

class AdminController{
    async showProducts(req,res,next){ 
        const catgories=await Category.getAll();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const cateName = "all";

        res.render('admin/showProduct', { catgories,  books, currentPage, totalPages, cateName,user:req.user, role: req.role });
    }

    async getBooksByCategory(req, res, next) {
        try {
            const cateName = req.params.categoryName;
            let cateID;
    
            if (cateName.toLowerCase() === 'all') {
                const itemsPerPage = 9;
                const currentPage = req.params.page || 1;
                const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
                const totalBooks = await Book.getCount();
                const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
                return res.json({ books, totalPages });
            } else {
                cateID = await Category.getCatIDByName(cateName);
            }
    
            const currentPage = req.params.page || 1;
            const itemsPerPage = 6;
    
            const books = await Book.getBookByIDCategoryWithPagination(cateID, currentPage, itemsPerPage);
            const totalBooks = await Book.getCountByCategory(cateID);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
            res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }  
    
    async adminCate(req,res,next){ 
        const categories=await Category.getAll();
        
        res.render('admin/categorypage',{categories,user:req.user, role: req.role });
    }

    async adminAddCatePage(req,res,next){         
        res.render('admin/addcategorypage', {user:req.user, role: req.role});
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

        res.render('admin/editcategorypage', {id, cateName, user:req.user, role: req.role});
    } 
}

module.exports=new AdminController;