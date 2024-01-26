const db = require('../utils/db');
const fs = require('fs');
const tbName = 'Order';

module.exports=class Book{
    constructor({listItems,listQuantity,userID,status,subTotal,shippingFee,total,address,phone,date}){
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

    static async findListOrder(id){
        const rs = await db.getOrder(tbName, "userID", id);
        return rs;
    }
    static async getAllOrderCount(){
      try {
          let rs = await db.query(`
              SELECT COUNT(*) AS order_count 
              FROM "Order";
          `);
          return rs[0].order_count;
      } catch (error) {
          throw (error);
      }
  }
  static async  getAllOrderWithPagination(currentPage, itemsPerPage) {
      currentPage = parseInt(currentPage.split("=")[1], 10);
      const offset = (currentPage - 1) * itemsPerPage;
      //const query = ;
      const books = await db.query(`SELECT *
      FROM "Order"
      ORDER BY id
      LIMIT ${itemsPerPage} OFFSET ${offset}
      `);
      return books;
  }
  static async getAllOrderFilterWithPagination(id, name, range, s, currentPage, itemsPerPage) {
    currentPage = parseInt(currentPage);
    const offset = (currentPage - 1) * itemsPerPage;

    // Xây dựng phần điều kiện cho filter id
    let idCondition = '';
    if (id !== 'all') {
        const parsedId = parseInt(id);
        if (!isNaN(parsedId)) {
            idCondition = `AND "userID" = ${parsedId}`;
        }
    }

    // Xây dựng phần điều kiện cho filter name
    let idOrderCondition = '';
    if (name !== 'all') {
        const parsedIdO = parseInt(name);
        if (!isNaN(parsedIdO)) {
          idOrderCondition = `AND "id" = ${parsedIdO}`;
        }
    }

    // Xây dựng phần điều kiện cho filter range
    let rangeCondition = '';
    switch (range) {
        case '0':
            // Không cần điều kiện nào nếu range là '0' (tất cả)
            break;
        case '1':
            rangeCondition = 'AND total BETWEEN 0 AND 300';
            break;
        case '2':
            rangeCondition = 'AND total BETWEEN 300 AND 1000';
            break;
        case '3':
            rangeCondition = 'AND total BETWEEN 1000 AND 3000';
            break;
        case '4':
            rangeCondition = 'AND total > 3000';
            break;
        // Thêm các case khác nếu có nhiều range hơn
    }

    // Xây dựng phần sắp xếp (ORDER BY) dựa trên giá trị của s
    let orderBy = '';
    switch (s) {
        case '0':
            orderBy = 'ORDER BY id';
            break;
        case '1':
            orderBy = 'ORDER BY "userID"';
            break;
        case '2':
            orderBy = 'ORDER BY total';
            break;
        // Thêm các case khác nếu có nhiều trường hợp sắp xếp hơn
    }

    // Xây dựng truy vấn SQL dựa trên các điều kiện và sắp xếp
    const query = `
        SELECT *
        FROM "Order" 
        WHERE 1 = 1
        ${idCondition}
        ${idOrderCondition}
        ${rangeCondition}
        ${orderBy}
        LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    const customers = await db.query(query);
    return customers;
}
static async getAllOrderFilterCount(id, name, range, s) {
    // Xây dựng phần điều kiện cho filter id
    let idCondition = '';
    if (id !== 'all') {
        const parsedId = parseInt(id);
        if (!isNaN(parsedId)) {
            idCondition = `AND "userID" = ${parsedId}`;
        }
    }

    // Xây dựng phần điều kiện cho filter name
    let idOrderCondition = '';
    if (name !== 'all') {
        const parsedIdO = parseInt(name);
        if (!isNaN(parsedIdO)) {
          idOrderCondition = `AND "id" = ${parsedIdO}`;
        }
    }

    // Xây dựng phần điều kiện cho filter range
    let rangeCondition = '';
    switch (range) {
        case '0':
            // Không cần điều kiện nào nếu range là '0' (tất cả)
            break;
        case '1':
            rangeCondition = 'AND total BETWEEN 0 AND 300';
            break;
        case '2':
            rangeCondition = 'AND total BETWEEN 300 AND 1000';
            break;
        case '3':
            rangeCondition = 'AND total BETWEEN 1000 AND 3000';
            break;
        case '4':
            rangeCondition = 'AND total > 3000';
            break;
        // Thêm các case khác nếu có nhiều range hơn
    }

    // Xây dựng truy vấn SQL dựa trên các điều kiện
    const query = `
        SELECT COUNT(*) AS total_count
        FROM "Order" 
        WHERE 1 = 1
        ${idCondition}
        ${idOrderCondition}
        ${rangeCondition}
    `;

    const result = await db.query(query);
    return result[0].total_count;
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