const db=require('../../MainSystem/utils/db');
const fs = require('fs');
const tbName = 'payAccount';

module.exports=class Book{
    constructor({id,balance,pin}){
        this.id=id;
        this.balance=balance;
        this.pin=pin;
    }

    static async get(clName, value) {
        const data = await db.get(tbName, clName, value);
        return data;
    }

    static async updateBalance(balance,id){
        let rs=await db.update(tbName,'balance',balance,'id',id);
        return rs;
    }

}