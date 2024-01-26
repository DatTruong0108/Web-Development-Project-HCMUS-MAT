const db=require('../utils/db')
const Book=require('../models/Book')
const Account=require('../models/account.m')
const Category=require('../models/Category')
const Order = require('../models/Order')
const jwt = require('jsonwebtoken')

module.exports = {
    getRevenue: async (req, res, next) => {
        const token = req.cookies.token;
        let username;
        let role;
        let avatar;
        if (token)
        {
         jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
           });
           const account = await Account.findAccount(username);
           //const customer = await Account.findCustomer(account.ID);
           //avatar = customer.avatar;
           req.user=account;
        }
        res.render('admin/revenuepage', {user: req.user, role:role} );
    },
    postRevenue: async(req,res,next) => {
        try{

        }catch(error){
            console.error('Error fetching revenue data:', error);
            // Handle the error, e.g., return an error response
            res.status(500).send('Error fetching revenue data');
        }
        const token = req.cookies.token;
        let username;
        let role;
        let avatar;
        if (token)
        {
         jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
           });
           const account = await Account.findAccount(username);
           //const customer = await Account.findCustomer(account.ID);
           //avatar = customer.avatar;
           req.user=account;
        }
        const start = (req.body.startDate).split('-');
        const end=(req.body.endDate).split('-');

        // Tạo đối tượng ngày giờ với các thành phần vừa phân tách
        const isoDateStart = new Date(`${start[0]}-${start[1]}-${start[2]}T00:00:00.000Z`);
        const isoDateEnd = new Date(`${end[0]}-${end[1]}-${end[2]}T00:00:00.000Z`);
        const labels = [];
        let currentDate = new Date(isoDateStart);
        while (currentDate <= isoDateEnd) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            labels.push(`${year}/${month}/${day}`);

            currentDate.setDate(currentDate.getDate() + 1);
        }
        const data = await Order.getRevenue(req.body.startDate, req.body.endDate);
        console.log(data);
        const totalAmountsMap = {};
        data.forEach(item => {
            const year = item.date.getFullYear();
            const month = (item.date.getMonth() + 1).toString().padStart(2, '0');
            const day = item.date.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}/${month}/${day}`;
            totalAmountsMap[formattedDate] = item.totalorder;
        });
        console.log("-----");
        // Lặp qua mảng labels và lấy ra totalAmounts tương ứng
        const totalAmounts = labels.map(label => totalAmountsMap[label] || 0);
        console.log(totalAmounts);
        res.render('admin/revenuepage', {
            data: JSON.stringify(totalAmounts),
            labels: labels,
            user: req.user, role:role
        });
    }
}