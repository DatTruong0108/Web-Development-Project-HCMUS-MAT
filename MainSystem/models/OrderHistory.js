const db = require('../utils/db');
const fs = require('fs');
const tbName = 'Order';

module.exports=class OrderHistory{
    constructor({listItems,listNames, listPrices, listQuantity, subTotal, shippingFee, date, status,total}){
        this.listItems=listItems;
        this.listNames = listNames;
        this.listPrices = listPrices;
        this.listQuantity = listQuantity;
        this.subTotal = subTotal;
        this.shippingFee = shippingFee;
        this.date = date;
        this.status = status;
        this.total = total;
    }
}