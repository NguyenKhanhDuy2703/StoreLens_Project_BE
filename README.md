# 📊 StoreLens - Backend API

Backend cho dự án **StoreLens** – Hệ thống phân tích hành vi khách hàng bằng **Thị giác máy tính (Computer Vision)** và **AIoT**.  
Dự án sử dụng **Node.js + Express + Sequelize** để xây dựng RESTful API, kết nối CSDL (MySQL / SQL Server), đồng thời hỗ trợ upload media qua Cloudinary.

---

## 🚀 Công nghệ sử dụng

- **Runtime & Framework**
  - Node.js
  - Express.js
- **Database & ORM**
  - Sequelize ORM
  - MySQL2 / SQL Server (Tedious)
- **Authentication & Security**
  - JWT (jsonwebtoken)
  - bcryptjs (hash password)
  - cookie-parser
  - cors
- **File Upload**
  - multer
  - cloudinary
  - multer-storage-cloudinary
- **Dev Tools**
  - nodemon (reload khi code thay đổi)
  - sequelize-cli (migration, seeders)
  - morgan (log request)
  - dotenv (quản lý biến môi trường)

---

## 📁 Cấu trúc thư mục

```
BE/
├── node_modules/          # Dependencies
├── src/
│   ├── config/            # Cấu hình DB (config.json, env)
│   ├── controllers/       # Controller: xử lý request/response
│   ├── middlewares/       # Middleware: auth, validate, logger
│   ├── migrations/        # Sequelize migration (tạo/sửa bảng)
│   ├── models/            # Định nghĩa Model (User, Product…)
│   ├── routes/            # Định nghĩa API routes
│   ├── seeders/           # Data mẫu (Seeder)
│   ├── service/           # Business logic/service layer
│   ├── uploads/           # Upload file tạm thời
│   ├── utils/             # Helper, utils (format, validation…)
│   └── app.js             # Entry point của server
├── package.json
└── package-lock.json
```

---

## ⚙️ Cài đặt & Chạy dự án

1. **Clone repository**
   ```bash
   git clone <repository_url>
   cd BE
   ```

2. **Cài dependencies**
   ```bash
   npm install
   ```

3. **Tạo file `.env` trong thư mục gốc**
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=storelens
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=xxxx
   CLOUDINARY_API_KEY=xxxx
   CLOUDINARY_API_SECRET=xxxx
   ```

4. **Chạy migration & seed (nếu có)**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Khởi chạy server**
   ```bash
   npm run start
   ```
   hoặc development mode:
   ```bash
   nodemon src/app.js
   ```

   Ứng dụng chạy tại: [http://localhost:3000](http://localhost:3000)

---

## 📌 Scripts trong `package.json`

- `npm run start` → Start server với **nodemon**  
- `npm test` → Placeholder test script  

---

## 👨‍💻 Thành viên nhóm

- **Nguyễn Khánh Duy** – Lead Developer / Backend & IoT  
- **Trương Thành Đạt** – Frontend Developer  
- **Liễu Thị Thùy Trang** – AI Engineer / Tester  
- **Phan Nguyễn Anh Thư** – QA / UI Designer  
- **Võ Thị Tường Vy** – Backend Developer  

---

## 📝 Quy tắc Commit Code

Để đảm bảo quy trình làm việc khoa học, minh bạch và dễ dàng theo dõi, tất cả các thành viên cần tuân thủ cấu trúc commit sau:

### 1. Mẫu Commit

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. Các thành phần

- **type (Loại thay đổi):**
  - `feat`: Thêm tính năng mới  
  - `fix`: Sửa lỗi  
  - `docs`: Thay đổi tài liệu (README.md, …)  
  - `style`: Thay đổi định dạng code, không ảnh hưởng logic  
  - `refactor`: Tái cấu trúc code, không thêm tính năng/không sửa lỗi  
  - `test`: Thêm/sửa test cases  
  - `chore`: Thay đổi build, công cụ, dependencies  
  - `perf`: Cải thiện hiệu suất  

- **scope (Phạm vi):**  
  Mô tả phần của dự án bị ảnh hưởng, ví dụ: auth, dashboard, heatmap, api, frontend, backend.  
  Nếu thay đổi ảnh hưởng nhiều phạm vi, có thể để trống hoặc dùng `general`.  

- **subject (Tiêu đề):**  
  Mô tả ngắn gọn thay đổi, dùng thì hiện tại, ví dụ: “Thêm”, “Sửa”, “Tái cấu trúc”.  
  Không kết thúc bằng dấu chấm. Có thể liên kết ID của task Jira (ví dụ: FEAT-123).  

- **body (Nội dung - không bắt buộc):**  
  Giải thích chi tiết lý do thay đổi, tác động, giải quyết vấn đề gì.  
  Nên ngắn gọn ≤ 72 ký tự mỗi dòng.  

- **footer (Chân trang - không bắt buộc):**
  - Thay đổi gây hỏng: `BREAKING CHANGE: <mô tả>`  
  - Đóng issue: `Closes #<issue-id>` hoặc `Resolves #<issue-id>`  

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Hãy tạo **Issue** hoặc gửi **Pull Request** để cải tiến dự án.  

---

## 📄 Giấy phép

Dự án phát hành theo **MIT License**. Xem file [LICENSE](LICENSE) để biết chi tiết.
