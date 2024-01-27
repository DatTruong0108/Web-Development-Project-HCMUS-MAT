const db=require('../../MainSystem/utils/db');
const fs = require('fs');
const tbName = 'Transaction';

module.exports = class Transaction {
  constructor({ senderID, receiverID, orderID, amount, content,date}) {
    this.senderID = senderID;
    this.receiverID = receiverID;
    this.orderID = orderID;
    this.amount = amount;
    this.content = content;
    this.date=date;
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
}
