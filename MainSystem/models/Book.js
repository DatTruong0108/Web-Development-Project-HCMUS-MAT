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
}