# Backend Structure - Truth or Dare API

## 📁 Cấu trúc thư mục

```
backend/
├── config/
│   └── db.js                    # Cấu hình kết nối MongoDB
├── models/
│   └── Question.js              # Schema và Model cho Question
├── controllers/
│   └── questionController.js    # Business logic xử lý các request
├── routes/
│   └── questionRoutes.js        # Định nghĩa các API endpoints
├── middleware/
│   └── errorHandler.js          # Middleware xử lý lỗi
├── .env                         # Biến môi trường
├── .gitignore
├── package.json
└── index.js                     # Entry point của ứng dụng
```

## 🔧 Mô tả các thành phần

### 1. **config/db.js**
- Quản lý kết nối đến MongoDB
- Sử dụng connection string từ biến môi trường

### 2. **models/Question.js**
- Định nghĩa schema cho Question
- Export Mongoose model để sử dụng trong controllers

### 3. **controllers/questionController.js**
- Chứa toàn bộ business logic
- Các functions:
  - `getAllQuestions()` - Lấy tất cả câu hỏi
  - `getQuestionsByCategory()` - Lấy câu hỏi theo category
  - `addQuestion()` - Thêm câu hỏi mới
  - `deleteQuestion()` - Xóa câu hỏi
  - `seedDefaultQuestions()` - Seed dữ liệu mẫu

### 4. **routes/questionRoutes.js**
- Định nghĩa các API endpoints
- Kết nối routes với controllers
- Routes:
  - `POST /api/questions/seed/default` - Seed dữ liệu
  - `GET /api/questions` - Lấy tất cả
  - `GET /api/questions/:category` - Lấy theo category
  - `POST /api/questions` - Thêm mới
  - `DELETE /api/questions/:id` - Xóa

### 5. **middleware/errorHandler.js**
- `errorHandler()` - Xử lý lỗi chung
- `notFound()` - Xử lý 404 Not Found

### 6. **index.js**
- Entry point của ứng dụng
- Khởi tạo Express app
- Mount các routes
- Áp dụng middleware

## 🚀 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| GET | `/api/questions` | Lấy tất cả câu hỏi |
| GET | `/api/questions/:category` | Lấy câu hỏi theo category (TRUTH/DARE/CỎ 3 LÁ) |
| POST | `/api/questions` | Thêm câu hỏi mới |
| DELETE | `/api/questions/:id` | Xóa câu hỏi |
| POST | `/api/questions/seed/default` | Seed dữ liệu mẫu |

## 🔐 Environment Variables

Tạo file `.env` với nội dung:

```env
PORT=3000
MONGODB_CONNECTIONSTRING=your_mongodb_connection_string
```

## 📦 Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development mode
npm run dev

# Seed dữ liệu mẫu (optional)
curl -X POST http://localhost:3000/api/questions/seed/default
```

## ✨ Ưu điểm của cấu trúc mới

1. **Separation of Concerns**: Mỗi file có trách nhiệm riêng biệt
2. **Dễ bảo trì**: Code được tổ chức rõ ràng, dễ tìm và sửa
3. **Scalable**: Dễ dàng thêm models, routes, controllers mới
4. **Testable**: Dễ viết unit tests cho từng phần
5. **Clean Code**: index.js giờ rất gọn gàng, chỉ lo việc khởi tạo app
