const db = require('../utils/db');
const fs = require('fs');

module.exports = class PaymentHistory {
    constructor({ id, listItems, listNames, listPrices, listQuantity, subTotal, shippingFee, date, status, total }) {
        this.id = id;
        this.listItems = listItems;
        this.listNames = listNames;
        this.listPrices = listPrices;
        this.listQuantity = listQuantity;
        this.subTotal = subTotal;
        this.shippingFee = shippingFee;
        this.date = date;
        this.status = status;
        this.total = total;
    }

    static async add(order) {
        const sql = `INSERT INTO Order (listItems, listNames, listPrices, listQuantity, subTotal, shippingFee, date, status, total)
        VALUES ('${order.listItems}', '${order.listNames}', '${order.listPrices}', '${order.listQuantity}', '${order.subTotal}', '${order.shippingFee}', '${order.date}', '${order.status}', '${order.total}')`;
        const result = await db.query(sql);
        return result;
    }

    static async getAll() {
        const sql = `SELECT * FROM Order`;
        const result = await db.query(sql);
        return result;
    }

    static async get(id) {
        const sql = `SELECT * FROM Order WHERE id = '${id}'`;
        const result = await db.query(sql);
        return result[0];
    }

    static async update(id, order) {
        const sql = `UPDATE Order SET listItems = '${order.listItems}', listNames = '${order.listNames}', listPrices = '${order.listPrices}', listQuantity = '${order.listQuantity}', subTotal = '${order.subTotal}', shippingFee = '${order.shippingFee}', date = '${order.date}', status = '${order.status}', total = '${order.total}' WHERE id = '${id}'`;
        const result = await db.query(sql);
        return result;
    }

    static async delete(id) {
        const sql = `DELETE FROM Order WHERE id = '${id}'`;
        const result = await db.query(sql);
        return result;
    }
}