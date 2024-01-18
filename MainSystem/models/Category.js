const db=require('../utils/db');
const fs = require('fs');
const tbName='Category';

module.exports=class Category{
    constructor({id,name}){
        this.id=id;
        this.name=name;
    }
   
    static async getAll(){
        const data=await db.getAll(tbName);
        return data;
    };
}