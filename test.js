
app.get('/donhangchuacoc', (req, res) => {
    // Query JOIN 3 bảng để lấy thông tin đầy đủ, thêm id_DatHomestay
    let sql = `
        SELECT 
            dh.id_DatHomestay, 
            dh.id_homestay,
            dh.ngay_dat,
            dh.ngay_tra,
            dh.tong_tien_dat,
            dh.TT_Thanhtoan,
            h.ten_homestay,
            h.TrangThai,
            u.ten_user,
            u.sdt_user,
            u.email_user
        FROM 
            dat_homestay AS dh
        JOIN 
            homestay AS h 
        ON 
            dh.id_homestay = h.id_homestay
        JOIN 
            users AS u 
        ON 
            dh.id_user = u.id_user
        WHERE 
            dh.TT_Thanhtoan = "chưa đặt cọc"
        ORDER BY 
            dh.id_DatHomestay DESC
    `;

    db.query(sql, (err, data) => {
        if (err) {
            console.error('Lỗi lấy danh sách đơn hàng:', err);
            res.status(500).json({ "thongbao": "Lỗi lấy danh sách đơn hàng", err });
        } else {
            res.status(200).json(data);
        }
    });
});

app.delete('/donhangchuacoc/:id', function (req, res){
    let id = req.params.id;
    let sql = `DELETE FROM dat_homestay WHERE id_DatHomestay =?`
    db.query(sql, id, (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi xóa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã xóa sản phẩm thành công"});
    })
})
app.get('/donhangdacoc', (req, res) =>{
    let sql = `SELECT 
            dh.id_DatHomestay, 
            dh.id_homestay,
            dh.ngay_dat,
            dh.ngay_tra,
            dh.tong_tien_dat,
            dh.TT_Thanhtoan,
            h.ten_homestay,
            h.TrangThai,
            u.ten_user,
            u.sdt_user,
            u.email_user
        FROM 
            dat_homestay AS dh
        JOIN 
            homestay AS h 
        ON 
            dh.id_homestay = h.id_homestay
        JOIN 
            users AS u 
        ON 
            dh.id_user = u.id_user
        WHERE 
            dh.TT_Thanhtoan = 'đã đặt cọc'
            ORDER BY
              dh.id_DatHomestay DESC 
            `
    db.query (sql, (err, data) =>{
        if(err) res.json({"thongbao":"Lỗii lấy list donhang", err});
        else res.json(data);
    })
})
app.get('/donhangdacoc/:id', (req, res) => {
    const { id } = req.params; // Lấy id từ URL
    const sql = `
        SELECT 
            dh.id_DatHomestay,  
            dh.id_homestay,
            dh.ngay_dat,
            dh.ngay_tra,
            dh.tong_tien_dat,
            dh.TT_Thanhtoan,
            h.ten_homestay,
            u.ten_user,
            u.sdt_user,
            u.email_user
        FROM 
            dat_homestay AS dh
        JOIN 
            homestay AS h 
        ON 
            dh.id_homestay = h.id_homestay
        JOIN 
            users AS u 
        ON 
            dh.id_user = u.id_user
        WHERE 
            dh.TT_Thanhtoan = 'đã đặt cọc'
        AND 
            dh.id_DatHomestay = ?
    `;

    db.query(sql, [id], (err, data) => {
        if (err) {
            res.status(500).json({ thongbao: "Lỗi lấy chi tiết đơn hàng", err });
        } else if (data.length === 0) {
            res.status(404).json({ thongbao: "Không tìm thấy đơn hàng với ID này" });
        } else {
            res.json(data[0]); // Trả về chi tiết đơn hàng
        }
    });
});

app.put('/donhangdacoc/:id', (req, res) => {
    const { id } = req.params;
    const {
        ngay_dat,
        ngay_tra,
        tong_tien_dat,
        id_user,
        created_at,
        TT_Thanhtoan, // Trạng thái thanh toán
        tien_coc_truoc, // Tiền cọc đã trả trước
        tien_can_thanhtoan, // Tiền cần thanh toán
        voucher // Voucher giảm giá (nếu có)
    } = req.body;

    // Kiểm tra đầu vào hợp lệ
    if (!id || !ngay_dat || !ngay_tra || !tong_tien_dat || !id_user || !created_at || !TT_Thanhtoan || !tien_coc_truoc || !tien_can_thanhtoan) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    // Câu truy vấn cập nhật
    const sqlUpdate = `
        UPDATE dat_homestay 
        SET 
            ngay_dat = ?, 
            ngay_tra = ?, 
            tong_tien_dat = ?, 
            id_user = ?, 
            created_at = ?, 
            TT_Thanhtoan = ?, 
            tien_coc_truoc = ?, 
            tien_can_thanhtoan = ?, 
            voucher = ?
        WHERE id_DatHomestay = ?`;

    // Thực hiện cập nhật dữ liệu
    db.query(
        sqlUpdate,
        [ngay_dat, ngay_tra, tong_tien_dat, id_user, created_at, TT_Thanhtoan, tien_coc_truoc, tien_can_thanhtoan, voucher, id],
        (err, result) => {
            if (err) {
                console.error('Lỗi khi cập nhật dữ liệu:', err);
                return res.status(500).json({ error: 'Lỗi khi cập nhật dữ liệu.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Không tìm thấy đơn đặt homestay.' });
            }

            res.status(200).json({ message: 'Cập nhật thành công!' });
        }
    );
});
app.delete('/donhangdacoc/:id', function (req, res){
    let id = req.params.id;
    let sql = `DELETE FROM dat_homestay WHERE id_DatHomestay =?`
    db.query(sql, id, (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi xóa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã xóa sản phẩm thành công"});
    })
})

app.get('/donhangdathanhtoan', (req, res) =>{
    let sql = `SELECT 
            dh.id_DatHomestay,  -- Thêm trường id_DatHomestay
            dh.id_homestay,
            dh.ngay_dat,
            dh.ngay_tra,
            dh.tong_tien_dat,
            dh.TT_Thanhtoan,
            h.ten_homestay,
            u.ten_user,
            u.sdt_user,
            u.email_user
        FROM 
            dat_homestay AS dh
        JOIN 
            homestay AS h 
        ON 
            dh.id_homestay = h.id_homestay
        JOIN 
            users AS u 
        ON 
            dh.id_user = u.id_user
        WHERE 
            dh.TT_Thanhtoan = 'đã thanh toán' `
    db.query (sql, (err, data) =>{
        if(err) res.json({"thongbao":"Lỗii lấy list donhang", err});
        else res.json(data);
    })
})
app.delete('/donhang/:id', function (req, res){
    let id = req.params.id;
    let sql = `DELETE FROM dat_homestay WHERE id_DatHomestay =?`
    db.query(sql, id, (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi xóa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã xóa sản phẩm thành công"});
    })
})

//check voucher
app.get("/donhangdacoc/:id", (req, res) => {
    const { id } = req.params;
  
    const sql = `
      SELECT dh.id_DatHomestay, hs.ten_homestay, dh.ten_user, dh.tong_tien_dat, dh.tien_coc_truoc
      FROM don_hang dh
      JOIN homestay hs ON dh.id_homestay = hs.id_homestay
      WHERE dh.id_DatHomestay = ?;
    `;
  
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ message: "Lỗi khi lấy dữ liệu đơn hàng" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
  
      res.json(results[0]);
    });
  });
  // Route để cập nhật trạng thái thanh toán
// Cập nhật thông tin thanh toán trong bảng dat_homestay
app.put('/donhangdathanhtoan/:id', (req, res) => {
    const orderId = req.params.id;
    const { TT_Thanhtoan, tong_tien_dat } = req.body;
  
    console.log('Dữ liệu nhận được từ frontend:', req.body);  // In ra để kiểm tra
  
    // Nếu dữ liệu bị thiếu
    if (!TT_Thanhtoan || !tong_tien_dat) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }
  
    const sqlQuery = `UPDATE dat_homestay SET TT_Thanhtoan = ?, tong_tien_dat = ? WHERE id_DatHomestay = ?`;
  
    db.query(sqlQuery, [TT_Thanhtoan, tong_tien_dat, orderId], (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật:', err);
        return res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật thông tin thanh toán!' });
      }
  
      console.log('Kết quả cập nhật:', result);  // Xem kết quả truy vấn SQL
  
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Cập nhật thành công!' });
      } else {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng với ID này.' });
      }
    });
  });
app.post("/don_hang", async (req, res) => {
    const { id_DatHomestay, ngay_giao_dich } = req.body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO don_hang (id_DatHomestay, ngay_giao_dich)
             VALUES (?, ?)`,
            [id_DatHomestay, ngay_giao_dich]
        );
        res.json({ message: "Thêm giao dịch mới thành công.", id: result.insertId });
    } catch (error) {
        console.error("Lỗi thêm giao dịch:", error);
        res.status(500).json({ error: "Lỗi server." });
    }
});

app.get('/hinhthuc_coc', (req, res) => {
    db.query('SELECT * FROM hinhthuc_coc', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi truy vấn dữ liệu' });
        }
        res.status(200).json(results); // Trả về tất cả các vouchers
    });
});

///////////////////////////////////////////////cho tao lam




/////////////////////////////////////////////cho tao lam