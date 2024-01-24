const db=require('../../MainSystem/utils/db');
const fs = require('fs');
const tbName = 'payAccount';

module.exports=class Book{
    constructor({id,balance}){
        this.id=id;
        this.balance=balance;
    }
}