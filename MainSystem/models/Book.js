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
}