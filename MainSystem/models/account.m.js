const db = require('../utils/db')

module.exports = class Account {
    constructor(obj) {
        this.username = obj.username;
        this.password = obj.password;
        this.ID = obj.ID;
        this.active = obj.active;
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