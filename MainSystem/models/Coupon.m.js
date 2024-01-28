const db = require('../utils/db')

module.exports = class Coupon {
    constructor(obj) {
        this.name = obj.name;
        this.customers = obj.customers;
        this.expireDate = obj.expireDate;
        this.quantity = obj.quantity;
        this.value = obj.value;
        this.minorder = obj.minorder;
        this.maxdiscount = obj.maxdiscount;
    }
    static async getByCusID(id){
        try {
            const query = 'SELECT * FROM "Coupon" WHERE $1 = ANY (customers)';
            const result = await db.query(query, [id]);
            return result;
        } catch(error) {
            throw error;
        }
    }
}