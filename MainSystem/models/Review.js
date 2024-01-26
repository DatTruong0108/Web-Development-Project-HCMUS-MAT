const db = require('../utils/db');
const fs = require('fs');
const tbName = 'Review';

module.exports=class Review{
    constructor({bookID,userID,feedback,date,username}){
        this.feedback=feedback;
        this.bookID=bookID;
        this.userID=userID;
        this.username=username;
        this.date=date;
    }

    static async insert(review){
        const rs=await db.insert(tbName,review,'id');
        return rs;
    }

    static async search(clName, value) {
        const data = await db.getMany(tbName, clName, value);
        return data;
    }
}