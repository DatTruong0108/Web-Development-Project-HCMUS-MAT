const db = require('../utils/db')

module.exports = class Account {
    constructor(obj) {
        this.username = obj.username;
        this.password = obj.password;
        this.ID = obj.ID;
        this.active = obj.active;
    }
    static async getAll(){
        try {
            let rs = await db.query(`SELECT * FROM "Account";`);
            return rs;
        } catch (error) {
            throw (error)
        };
    }
    static async getAllCustomer(){
        try {
            let rs = await db.query(`
                SELECT * 
                FROM "Account" AS a
                JOIN "Customer" AS c ON a.ID = c.customer_id;
                `);
            return rs;
        } catch (error) {
            throw (error)
        };
    }
    static async getAllCustomerCount(){
        try {
            let rs = await db.query(`
                SELECT COUNT(*) AS customer_count 
                FROM "Customer";
            `);
            return rs[0].customer_count;
        } catch (error) {
            throw (error);
        }
    }
    static async  getAllCustomerWithPagination(currentPage, itemsPerPage) {
        currentPage = parseInt(currentPage.split("=")[1], 10);
        const offset = (currentPage - 1) * itemsPerPage;
        //const query = ;
        const books = await db.query(`SELECT a.*, c.*, COALESCE(o.total_order, 0) AS total_order
        FROM "Account" AS a
        JOIN "Customer" AS c ON a."ID" = c.customer_id
        LEFT JOIN (
            SELECT "userID", COALESCE(SUM(total), 0) AS total_order
            FROM "Order"
            GROUP BY "userID"
        ) AS o ON c.customer_id = o."userID"
        ORDER BY c.customer_id
        LIMIT ${itemsPerPage} OFFSET ${offset}
        `);
        return books;
    }
    static async getAllCustomerFilterWithPagination(id, name, range, s, currentPage, itemsPerPage) {
        currentPage = parseInt(currentPage);
        const offset = (currentPage - 1) * itemsPerPage;
    
        // Xây dựng phần điều kiện cho filter id
        let idCondition = '';
        if (id !== 'all') {
            const parsedId = parseInt(id);
            if (!isNaN(parsedId)) {
                idCondition = `AND c.customer_id = ${parsedId}`;
            }
        }
        
        // Xây dựng phần điều kiện cho filter name
        let nameCondition = '';
        if (name !== 'all') {
            nameCondition = `AND c.fullname LIKE '%${name}%'`;
        }
    
        // Xây dựng phần điều kiện cho filter range
        let rangeCondition = '';
        switch (range) {
            case '0':
                // Không cần điều kiện nào nếu range là '0' (tất cả)
                break;
            case '1':
                rangeCondition = 'AND o.total_order BETWEEN 0 AND 300';
                break;
            case '2':
                rangeCondition = 'AND o.total_order BETWEEN 300 AND 1000';
                break;
            case '3':
                rangeCondition = 'AND o.total_order BETWEEN 1000 AND 3000';
                break;
            case '4':
                rangeCondition = 'AND o.total_order > 3000';
                break;
            // Thêm các case khác nếu có nhiều range hơn
        }
    
        // Xây dựng phần sắp xếp (ORDER BY) dựa trên giá trị của s
        let orderBy = '';
        switch (s) {
            case '0':
                orderBy = 'ORDER BY c.customer_id';
                break;
            case '1':
                orderBy = 'ORDER BY c.fullname';
                break;
            case '2':
                orderBy = 'ORDER BY o.total_order';
                break;
            // Thêm các case khác nếu có nhiều trường hợp sắp xếp hơn
        }
    
        // Xây dựng truy vấn SQL dựa trên các điều kiện và sắp xếp
        const query = `
            SELECT a.*, c.*, COALESCE(o.total_order, 0) AS total_order
            FROM "Account" AS a
            JOIN "Customer" AS c ON a."ID" = c.customer_id
            LEFT JOIN (
                SELECT "userID", COALESCE(SUM(total), 0) AS total_order
                FROM "Order"
                GROUP BY "userID"
            ) AS o ON c.customer_id = o."userID"
            WHERE 1 = 1
            ${idCondition}
            ${nameCondition}
            ${rangeCondition}
            ${orderBy}
            LIMIT ${itemsPerPage} OFFSET ${offset}
        `;
    
        const customers = await db.query(query);
        return customers;
    }
    static async getAllCustomerFilterCount(id, name, range, s) {
        // Xây dựng phần điều kiện cho filter id
        let idCondition = '';
        if (id !== 'all') {
            const parsedId = parseInt(id);
            if (!isNaN(parsedId)) {
                idCondition = `AND c.customer_id = ${parsedId}`;
            }
        }
    
        // Xây dựng phần điều kiện cho filter name
        let nameCondition = '';
        if (name !== 'all') {
            nameCondition = `AND c.fullname LIKE '%${name}%'`;
        }
    
        // Xây dựng phần điều kiện cho filter range
        let rangeCondition = '';
        switch (range) {
            case '0':
                // Không cần điều kiện nào nếu range là '0' (tất cả)
                break;
            case '1':
                rangeCondition = 'AND o.total_order BETWEEN 0 AND 300';
                break;
            case '2':
                rangeCondition = 'AND o.total_order BETWEEN 300 AND 1000';
                break;
            case '3':
                rangeCondition = 'AND o.total_order BETWEEN 1000 AND 3000';
                break;
            case '4':
                rangeCondition = 'AND o.total_order > 3000';
                break;
            // Thêm các case khác nếu có nhiều range hơn
        }
    
        // Xây dựng truy vấn SQL dựa trên các điều kiện
        const query = `
            SELECT COUNT(*) AS total_count
            FROM "Account" AS a
            JOIN "Customer" AS c ON a."ID" = c.customer_id
            LEFT JOIN (
                SELECT "userID", COALESCE(SUM(total), 0) AS total_order
                FROM "Order"
                GROUP BY "userID"
            ) AS o ON c.customer_id = o."userID"
            WHERE 1 = 1
            ${idCondition}
            ${nameCondition}
            ${rangeCondition}
        `;
    
        const result = await db.query(query);
        return result[0].total_count;
    }
    static async DeleteAccount(id) {
        try {
            await db.query('BEGIN');
      
            // Delete from Account table
            await db.query('DELETE FROM "Account" WHERE "ID" = $1', [id]);
      
            // Delete from Customer table
            await db.query('DELETE FROM "Customer" WHERE customer_id = $1', [id]);
      
            await db.query('COMMIT');
            return true; // Return true if both deletions were successful
              
          } catch (e) {
            await db.query('ROLLBACK');
            return false;
          }
    }

    
    static async findAccount(username) {
        try {
            let rs = await db.query(`SELECT * FROM "Account" WHERE "username" = '${username}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
    static async findAccountById(id) {
        try {
            let rs = await db.query(`SELECT * FROM "Account" WHERE "ID" = '${id}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
    static async addAccount(signUpInfor) {
        try {
            let maxId = (await db.query(`SELECT MAX("ID") FROM "Account"`))[0].max;
            let newId = maxId == null ? 1 : maxId + 1;
            await db.query(`INSERT INTO "Account"(
                                "ID", "username", "password", "active")
                                VALUES (${newId}, '${signUpInfor.username}', '${signUpInfor.password}', 'true');`);
            return newId;
        } catch (error) {
            throw error;
        };
    }
    static async addPayAccount(signUpInfor) {
        try {
            let newId =parseInt(signUpInfor.id)
            await db.query(`INSERT INTO "payAccount"(
                                "id", "balance")
                                VALUES (${newId}, '${signUpInfor.balance}');`);
            return newId;
        } catch (error) {
            throw error;
        };
    }
    static async addCustomer(signUpInfor, id){
        try {
            if(signUpInfor.dob == null){
                await db.query(`INSERT INTO "Customer"(
                    "customer_id", "fullname", "email", "gender", "address", "avatar")
                    VALUES (${id}, '${signUpInfor.fullname}','${signUpInfor.email}','${signUpInfor.gender}', '${signUpInfor.address}', '${signUpInfor.avatar}');`);
                return true;
            }
            await db.query(`INSERT INTO "Customer"(
                                "customer_id", "fullname", "dob", "email", "gender", "address", "avatar")
                                VALUES (${id}, '${signUpInfor.fullname}','${signUpInfor.dob}','${signUpInfor.email}','${signUpInfor.gender}', '${signUpInfor.address}', '${signUpInfor.avatar}');`);
            return true;
        } catch (error) {
            throw error;
        };
    }
    static async findCustomer(id) {
        try {
            let rs = await db.query(`SELECT * FROM "Customer" WHERE "customer_id" = '${id}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
    static async findAdmin(id) {
        try {
            let rs = await db.query(`SELECT * FROM "Admin" WHERE "admin_id" = '${id}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
}