const db = require('../utils/db');
const fs = require('fs');
const tbName = 'Book';

module.exports=class Book{
    constructor({name,author,catID,image,price,quantity,description,releaseDate,sold}){
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

    static async delete(id){
        const rs=await db.delete(tbName,'id',id);
        return rs;
    }

    static async getAll() {
        const data = await db.getAll(tbName);
        return data;
    };

    static async get(clName, value) {
        const data = await db.get(tbName, clName, value);

        return data;
    }

    static async search(clName, value) {
        const data = await db.getMany(tbName, clName, value);

        return data;
    }

    static async insert(book){
        const rs=await db.insert(tbName,book,'id');
        return rs;
    }

    static async update(user,id){
        let rs=await db.update(tbName,'name',user.name,'id',id);
        rs=await db.update(tbName,'author',user.author,'id',id);
        rs=await db.update(tbName,'description',user.description,'id',id);
        rs=await db.update(tbName,'catID',user.catID,'id',id);
        rs=await db.update(tbName,'price',user.price,'id',id); 
        rs=await db.update(tbName,'quantity',user.quantity,'id',id);
        rs=await db.update(tbName,'releaseDate',user.releaseDate,'id',id);
        rs=await db.update(tbName,'image',user.image,'id',id);
        return rs;
    }

    static async searchLike(clName,_id){
        const data=await db.searchLike(tbName,clName,_id);
    }

    static async searchLike(clName, _id) {
        const data = await db.searchLike(tbName, clName, _id);

        return data;
    }


    static async getBookByIDCategory(cateID) {
        const books = await db.getAll(tbName);
        const booksInCategory = books.filter(book => book.catID === cateID);

        return booksInCategory;
    }

    static async getBestSelling() {
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

    static async getBookByName(name) {
        try {
            const query = `
                SELECT *
                FROM "Book"
                WHERE "name" = $1;`;
            const data = await db.any(query, [name]);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getAllAuthors() {
        try {
            const query = `
                SELECT DISTINCT "author"
                FROM "Book";
            `;

            const data = await db.any(query);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getBookByAuthorWithPagination(author, currentPage, itemsPerPage) {
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
                WHERE "author" = $1
                OFFSET $2
                LIMIT $3;
            `;

            const data = await db.any(query, [author, offset, itemsPerPage]);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getCountByAuthor(author) {
        try {
            const query = `
                SELECT COUNT(*)
                FROM "Book"
                WHERE "author" = $1;
            `;

            const result = await db.one(query, [author]);
            const count = parseInt(result.count, 10);

            return count;
        } catch (error) {
            throw error;
        }
    }

    static async getBookByPrice(minPrice, maxPrice) {
        try {
            const query = `
                SELECT *
                FROM "Book"
                WHERE "price" BETWEEN $1::money AND $2::money;
            `;

            const data = await db.any(query, [minPrice, maxPrice]);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getBookByPriceWithPagination(minPrice, maxPrice, currentPage, itemsPerPage) {
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
                WHERE "price" BETWEEN $1::money AND $2::money
                OFFSET $3
                LIMIT $4;
            `;

            const data = await db.any(query, [minPrice, maxPrice, offset, itemsPerPage]);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getCountByPrice(minPrice, maxPrice) {
        try {
            const query = `
                SELECT *
                FROM "Book"
                WHERE "price" BETWEEN $1::money AND $2::money
            `;

            const data = await db.any(query, [minPrice, maxPrice]);
            return data.length;
        } catch (error) {
            throw error;
        }
    }
}