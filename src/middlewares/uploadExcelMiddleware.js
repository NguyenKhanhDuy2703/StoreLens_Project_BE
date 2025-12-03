const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// CẤU HÌNH LƯU FILE VÀO Ổ CỨNG (DiskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Lưu vào thư mục uploads
  },
  filename: (req, file, cb) => {
    // Đặt tên file unique để không bị trùng
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('excel') || 
    file.mimetype.includes('spreadsheetml') ||
    file.originalname.match(/\.(xlsx|xls)$/)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'), false);
  }
};

const uploadExcel = multer({ storage: storage, fileFilter: fileFilter });
module.exports = uploadExcel;