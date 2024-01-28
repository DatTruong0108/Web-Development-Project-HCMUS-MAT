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
            const query = 'SELECT * FROM "Coupon" WHERE $1 = ANY (customers) and quantity > 0';
            const result = await db.query(query, [id]);
            return result;
        } catch(error) {
            throw error;
        }
    }
    static async usedCoupon(id, cusid){
        try {        
            // Remove cusid from customers array and decrement quantity by 1
            const query = {
              text: `
                UPDATE "Coupon"
                SET 
                  customers = array_remove(customers, $2),
                  quantity = quantity - 1
                WHERE id = $1
              `,
              values: [id, cusid],
            };
        
            const result = await db.query(query);
        
            return result.rowCount > 0; // Return true if a row was updated
          } catch (err) {
            console.error('Error executing query', err);
            throw err;
          }
    }
}