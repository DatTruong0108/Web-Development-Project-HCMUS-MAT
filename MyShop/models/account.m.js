const db = require('../database/db')

module.exports = class Account {
    constructor(obj) {
        this.username = obj.username;
        this.password = obj.password;
        this.ID = obj.ID;
        this.active = obj.active;
    }
    static async findAccount(username) {
        try {
            let rs = await db.execute(`SELECT * FROM "Account" WHERE "username" = '${username}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
    static async findAccountById(id) {
        try {
            let rs = await db.execute(`SELECT * FROM "Account" WHERE "ID" = '${id}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
    static async addAccount(signUpInfor) {
        try {
            let maxId = (await db.execute(`SELECT MAX("ID") FROM "Account"`))[0].max;
            let newId = maxId == null ? 1 : maxId + 1;
            await db.execute(`INSERT INTO "Account"(
                                "ID", "username", "password", "active")
                                VALUES (${newId}, '${signUpInfor.username}', '${signUpInfor.password}', 'true');`);
            return newId;
        } catch (error) {
            throw error;
        };
    }
    static async addCustomer(signUpInfor, id){
        try {
            await db.execute(`INSERT INTO "Customer"(
                                "customer_id", "fullname", "dob", "email", "gender", "address", "avatar")
                                VALUES (${id}, '${signUpInfor.fullname}','${signUpInfor.dob}','${signUpInfor.email}','${signUpInfor.gender}', '${signUpInfor.address}', '${signUpInfor.avatar}');`);
            return true;
        } catch (error) {
            throw error;
        };
    }
    static async findCustomer(id) {
        try {
            let rs = await db.execute(`SELECT * FROM "Customer" WHERE "customer_id" = '${id}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
    static async findAdmin(id) {
        try {
            let rs = await db.execute(`SELECT * FROM "Admin" WHERE "admin_id" = '${id}';`);
            return rs[0];
        } catch (error) {
            throw (error)
        };
    }
}