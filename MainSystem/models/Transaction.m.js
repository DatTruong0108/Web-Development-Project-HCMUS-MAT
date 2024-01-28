const db = require('../utils/db');
const Order = require('../models/Order')
const Transaction=require('../../SubSystem/models/Transaction');
const payAccount=require('../../SubSystem/models/payAccount')
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
    transaction: async(adBalance, cusBalance, total, cusID, trans, id, newStatus) =>{
        try {
            const highestIdQuery = 'SELECT MAX(id) AS maxid FROM "Transaction"';
            const highestIdResult = await db.query(highestIdQuery);
            const maxId = parseInt(highestIdResult[0].maxid) || 1;
            const newId = maxId + 1;

            trans.id = newId;
            // Increment the highest id by 1 to get the new id for the new coupon
            const query2 = {
                text: `
                UPDATE "payAccount" SET balance = $1 WHERE "id" = $2
                `,
                values: [adBalance-total, 1]
            }
            const query1 = {
                text: `
                UPDATE "payAccount" SET balance = $1 WHERE "id" = $2
                `,
                values: [cusBalance+total, cusID]
            }
            const query3 = {
                text: `INSERT INTO "Transaction" ("senderID", "receiverID", "orderID", amount, content, date) 
                Values ($1, $2, $3, $4, $5, $6)
                `,
                values: [trans.senderID, trans.receiverID, parseInt(trans.orderID), trans.amount, trans.content, trans.date]
            }
            const query4 = {
                text: `
                UPDATE "Order" SET status = $1 WHERE "id" = $2
                `,
                values: [newStatus, id]
            };
            const rs = db.execTrans(query1,query2,query3,query4);
            return true;
            //await db.query('COMMIT'); // Nếu không có lỗi, lưu thay đổi vào cơ sở dữ liệu
        } catch (error) {
            //await db.query('ROLLBACK'); // Nếu có lỗi, hủy bỏ toàn bộ giao dịch
            throw error;
        } finally{
            return true;
        }
        
    }
}