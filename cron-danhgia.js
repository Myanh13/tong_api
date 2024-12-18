const db = require('./DB');
const cron = require('node-cron'); 
 // Hàm cập nhật sao trung bình chạy sao 10s test cho hội đồng

// const updateRatings = () => {
//   const query = `
//     SELECT 
//       id_homestay, 
//       COUNT(id_homestay) AS total_reviews, 
//       SUM(sao) AS total_stars 
//     FROM danh_gia 
//     GROUP BY id_homestay
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Lỗi khi truy vấn bảng danh_gia:", err.message);
//       return;
//     }

//     const updatePromises = results.map((row) => {
//       const { id_homestay, total_reviews, total_stars } = row;
//       const averageRating = total_reviews > 0 ? total_stars / total_reviews : 0;
//       const roundedRating = Math.round(averageRating * 100) / 100; // Làm tròn 2 chữ số thập phân

//       console.log(`Homestay ${id_homestay}: total_reviews=${total_reviews}, total_stars=${total_stars}, averageRating=${roundedRating}`);

//       return new Promise((resolve, reject) => {
//         db.query(
//           `UPDATE homestay SET danh_gia = ? WHERE id_homestay = ?`,
//           [roundedRating, id_homestay],
//           (updateErr) => {
//             if (updateErr) {
//               console.error(`Lỗi khi cập nhật id_homestay ${id_homestay}:`, updateErr.message);
//               return reject(updateErr);
//             }
//             resolve();
//           }
//         );
//       });
//     });

//     Promise.all(updatePromises)
//       .then(() => {
//         console.log("Cập nhật danh_gia thành công.");
//       })
//       .catch((updateErr) => {
//         console.error("Lỗi khi cập nhật bảng homestay:", updateErr.message);
//       });
//   });
// };

// // Lịch trình chạy mỗi 10 giây
// setInterval(() => {
//   console.log("Đang chạy cập nhật sao trung bình...");
//   updateRatings();
// }, 100000); 

///////////////////////////////////////////////////////////
// Hàm cập nhật sao trung bình chạy sau 00 giờ

// Hàm cập nhật sao trung bình
const updateRatings = () => {
  const query = `
    SELECT 
      id_homestay, 
      COUNT(id_homestay) AS total_reviews, 
      SUM(sao) AS total_stars 
    FROM danh_gia 
    GROUP BY id_homestay
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn bảng danh_gia:", err.message);
      return;
    }

    const updatePromises = results.map((row) => {
      const { id_homestay, total_reviews, total_stars } = row;
      const averageRating = total_reviews > 0 ? total_stars / total_reviews : 0;
      const roundedRating = Math.round(averageRating * 100) / 100; // Làm tròn 2 chữ số thập phân

      console.log(`Homestay ${id_homestay}: total_reviews=${total_reviews}, total_stars=${total_stars}, averageRating=${roundedRating}`);

      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE homestay SET danh_gia = ? WHERE id_homestay = ?`,
          [roundedRating, id_homestay],
          (updateErr) => {
            if (updateErr) {
              console.error(`Lỗi khi cập nhật id_homestay ${id_homestay}:`, updateErr.message);
              return reject(updateErr);
            }
            resolve();
          }
        );
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        console.log("Cập nhật danh_gia thành công.");
      })
      .catch((updateErr) => {
        console.error("Lỗi khi cập nhật bảng homestay:", updateErr.message);
      });
  });
};

// Lịch trình chạy vào mỗi 00:00 hàng ngày (Cron job)
cron.schedule('0 0 * * *', () => {
  console.log("Đang chạy cập nhật sao trung bình vào lúc 00:00...");
  updateRatings();
});
