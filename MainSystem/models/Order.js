const db = require('../utils/db');
const fs = require('fs');
const tbName = 'Order';

module.exports=class Order{
    constructor({id, listItems,listQuantity,userID,status,subTotal,shippingFee,total,address,phone,date}){
        this.id=id;
        this.listItems=listItems;
        this.listQuantity=listQuantity;
        this.userID=userID;
        this.status=status;
        this.subTotal=subTotal;
        this.shippingFee=shippingFee;
        this.total=total;
        this.address=address;
        this.phone=phone;
        this.date=date;
    }

    static async insert(order){
        const rs=await db.insert(tbName,order,'id');
        return rs;
    }

    static async getByID(id) {
        const data = await db.get(tbName, 'id', id);
        return data;
    }

    static async updateStatus(id, status) {
        const rs = await db.update(tbName, 'status', status, 'id', id);
        return rs;
    }

    static async findListOrder(id){
        const rs = await db.getOrder(tbName, "userID", id);
        return rs;
    }
    static async getRevenue(startDate, endDate) {
        try {
          // Kết nối đến cơ sở dữ liệu
          //const client = await pool.connect();
            console.log(startDate + " " + endDate);
          // Truy vấn lấy tổng doanh thu theo ngày
          const query = `
            SELECT date, SUM(total) AS totalOrder
            FROM "Order"
            WHERE date >= $1 AND date <= $2
            GROUP BY date
            ORDER BY date;
          `;
      
          // Thực hiện truy vấn với các tham số startDate và endDate
          const rs = await db.query(query, [startDate, endDate]);
      
          // Giải phóng kết nối
          //client.release();
      
          // Trả về kết quả
          return rs;
        } catch (err) {
          // Xử lý lỗi nếu có
          console.error('Error executing query', err);
          throw err;
        }
      }
}