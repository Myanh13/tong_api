const mysql = require('mysql2');
// const multer = require('multer');

// Tạo kết nối
const db = mysql.createConnection({
    host: 'bj4ifi8a432utczbucbd-mysql.services.clever-cloud.com',
    user: 'uznrgnz1a1wscoeg',
    password: '3AJv1F5PbsWlkNdMsYRr',
    port: 3306,
    database: 'bj4ifi8a432utczbucbd'
});

db.connect(err => {
    if (err) {
        console.error("Lỗi kết nối database:", err.message);
        process.exit(1);
    }
    console.log("Đã kết nối database từ database.js");
});

module.exports = db; // Export đối tượng db
