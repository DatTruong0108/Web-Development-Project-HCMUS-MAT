const db=require('../utils/db');
const fs = require('fs');
const tbName='Book';

module.exports=class Book{
    constructor({id,name,author,catID,image,price,quantity,description,releaseDate,sold}){
        this.id=id;
        this.name=name;
        this.author=author;
        this.catID=catID;
        this.image=image;
        this.price=price;
        this.quantity=quantity;
        this.description=description;
        this.releaseDate=releaseDate;
        this.sold=sold;
    }
   
    static async getAll(){
        const data=await db.getAll(tbName);
        return data;
    };

    static async get(clName,value){
        const data=await db.get(tbName,clName,value);

        return data;
    }

    static async search(clName,value){
        const data=await db.getMany(tbName,clName,value);

        return data;
    }

    // static async searchBook(key){
    //     const data=await db.search(key);
    //     console.log(data);

    //     return data;
    // }

    static async getBookByIDCategory(cateID) {
        const books = await db.getAll(tbName);
        const booksInCategory = books.filter(book => book.catID === cateID);
    
        return booksInCategory;
    }    

    static async getBestSelling(){
        const movies = await db.getAll(tbName);
       // Sắp xếp mảng theo thuộc tính "sold" giảm dần
       movies.sort((a, b) => b.sold - a.sold);
        // Lấy ra 10 phần tử đầu tiên
        const bestSellingMovies = movies.slice(0, 20);
        return bestSellingMovies;
    }

    static async getLatestRelease() {
        const movies = await db.getAll(tbName);
      
        // Sắp xếp danh sách theo releaseDate từ thấp đến cao
        movies.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
      
        // Lấy ra 10 phim đầu tiên
        const bestSellingMovies = movies.slice(0, 20);
      
        return bestSellingMovies;
      }

    static async getAllWithPagination(currentPage, itemsPerPage) {
        currentPage = parseInt(currentPage.split("=")[1], 10);
        const offset = (currentPage - 1) * itemsPerPage;
        const query = `SELECT * FROM  "Book" LIMIT ${itemsPerPage} OFFSET ${offset}`;
        const books = await db.query(query);
        return books;
    }

    static async getCount() {
        const query = 'SELECT COUNT(*) as totalBooks FROM  "Book"';
        const result = await db.query(query);
        const rs = result[0].totalbooks;
        return rs;
    }

    static async getBookByIDCategoryWithPagination(categoryID, currentPage, itemsPerPage) {
        try {
            if (currentPage && typeof currentPage === 'string') {
                currentPage = parseInt(currentPage.split("=")[1], 10);
            } else {
                currentPage = 1; // Giá trị mặc định nếu không có hoặc không phải là chuỗi
            }
    
            const offset = (currentPage - 1) * itemsPerPage;
            const query = `
                SELECT *
                FROM "Book"
                WHERE "catID" = $1
                OFFSET $2
                LIMIT $3;
            `;
    
            const data = await db.any(query, [categoryID, offset, itemsPerPage]);
            return data;
        } catch (error) {
            throw error;
        }
    }    

    static async getCountByCategory(categoryID) {
        try {
            const query = `
                SELECT COUNT(*)
                FROM "Book"
                WHERE "catID" = $1;
            `;
    
            const result = await db.one(query, [categoryID]);
            const count = parseInt(result.count, 10);
    
            return count;
        } catch (error) {
            throw error;
        }
    }    

}