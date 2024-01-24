const db = require('../utils/db');
const fs = require('fs');
const tbName = 'Order';

module.exports=class Book{
    constructor({listItems,listQuantity,userID,status,subTotal,shippingFee,total}){
        this.listItems=listItems;
        this.listQuantity=listQuantity;
        this.userID=userID;
        this.status=status;
        this.subTotal=subTotal;
        this.shippingFee=shippingFee;
        this.total=total;
    }

    static async insert(order){
        const rs=await db.insert(tbName,order,'id');
        return rs;
    }
}