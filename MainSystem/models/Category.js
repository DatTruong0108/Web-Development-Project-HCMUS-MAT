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

    static async get(){
        const data=await db.get(tbName);
        return data;
    };


    static async getCatIDByName(cateName){
        const categories =await db.getAll(tbName);
        const category = categories.find(category => category.name === cateName);

        if (category) {
            return category.id;
        } else {
            return null;
        }
    };


    /* Admin CRU Category*/
    static async getCatNameByID(cateID){
        const categories =await db.getAll(tbName);
        cateID = parseInt(cateID );
        const category = categories.find(category => category.id === cateID);

        if (category) {
            return category.name;
        } else {
            return null;
        }
    };

    static async insert(cateName){
        const categories =await db.getAll(tbName);
        const id = categories.length + 1;
        const rs = await db.insertCategory(tbName, cateName, id);

        return rs;
    };

    static async deleteCateByID(id){
        const rs = await db.deleteCategory(tbName, id);

        return rs;
    };

    static async editCateByID(cateName, id){
        const rs = await db.editCategory(tbName, cateName, id);

        return rs;
    };
}