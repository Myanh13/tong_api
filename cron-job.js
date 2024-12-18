const db = require('./DB'); // Import đối tượng db từ file kết nối database

function checkAndUpdatePaymentStatus() {
    const query = `
        UPDATE dat_homestay
        SET TT_Thanhtoan = 'đã hủy'
        WHERE TT_Thanhtoan = 'chờ thanh toán'
          AND NOW() > expiration_time
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật trạng thái thanh toán:', err.message);
            return;
        }
        console.log(`Cron job: Đã cập nhật ${results.affectedRows} bản ghi trạng thái thành "đã hủy".`);
    });
}

// Chạy cron job ngay lập tức
checkAndUpdatePaymentStatus();


setInterval(() => {
    console.log('Cron job đang kiểm tra trạng thái thanh toán...');
    checkAndUpdatePaymentStatus();
}, 300000); // 300000ms = 5 phút

// setInterval(() => {
//     console.log('Cron job đang kiểm tra trạng thái thanh toán...');
//     checkAndUpdatePaymentStatus();
// }, 600000); // 600000ms = 10 phút

