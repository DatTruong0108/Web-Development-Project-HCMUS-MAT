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
            const query = 'SELECT * FROM "Coupon" WHERE $1 = ANY (customers) and quantity > 0 AND "expireDate" > CURRENT_DATE';
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
    static async getAllCouponCount(){
        try {
            let rs = await db.query(`
                SELECT COUNT(*) AS order_count 
                FROM "Coupon";
            `);
            return rs[0].order_count;
        } catch (error) {
            throw (error);
        }
    }
    static async  getAllCouponWithPagination(currentPage, itemsPerPage) {
        currentPage = parseInt(currentPage.split("=")[1], 10);
        const offset = (currentPage - 1) * itemsPerPage;
        //const query = ;
        const books = await db.query(`SELECT *
        FROM "Coupon"
        ORDER BY id
        LIMIT ${itemsPerPage} OFFSET ${offset}
        `);
        return books;
    }
    static async DeleteCoupon(id) {
        try {
            await db.query('BEGIN');
      
            // Delete from Account table
            await db.query('DELETE FROM "Coupon" WHERE "id" = $1', [id]);
                  
            await db.query('COMMIT');
            return true; // Return true if both deletions were successful
              
          } catch (e) {
            await db.query('ROLLBACK');
            return false;
          }
    }
    static async AddCoupon(data) {
        try {
            // Get the highest id from the Coupon table
            const highestIdQuery = 'SELECT MAX(id) AS maxid FROM "Coupon"';
            const highestIdResult = await db.query(highestIdQuery);
            const maxId = parseInt(highestIdResult[0].maxid) || 1;
        
            // Increment the highest id by 1 to get the new id for the new coupon
            const newId = maxId + 1;
            let customerIds = [];
            if (data.customers.length === 0) {
            // If customers is an empty string, select all customer_id from Customer table
            const customerIdsQuery = 'SELECT customer_id FROM "Customer"';
            const customerIdsResult = await db.query(customerIdsQuery);
            customerIds = customerIdsResult.map(row => row.customer_id);
            } else {
            // Parse customers into an array of integers
            customerIds = data.customers;
            }
            // Insert the new coupon into the Coupon table
            const insertQuery = {
                text: `
                    INSERT INTO "Coupon" (id, name, "expireDate", value, minorder, maxdiscount, quantity, customers)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `,
                values: [
                newId,
                data.name,
                data.expireDate,
                data.value !== '' ? parseFloat(data.value) : 0,
                data.minorder !== '' ? parseFloat(data.minorder) : 0,
                data.maxdiscount !== '' ? parseFloat(data.maxdiscount) : 0,
                data.quantity !== '' ? parseInt(data.quantity) : 0,
                customerIds
                ]
            };
        
            await db.query(insertQuery);
        
            // Return the new coupon id
            return newId;
            } catch (error) {
            // Handle database error
            console.error(error);
            throw error;
            }
        }
      
}