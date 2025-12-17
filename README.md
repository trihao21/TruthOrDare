# Truth or Dare - Spin to Win 🎡

Game Truth or Dare với vòng quay may mắn, hệ thống quản lý câu hỏi và backend API.

## 📁 Cấu trúc Project

```
/
├── frontend/          # Frontend (Vite + Vanilla JS + Tailwind)
├── backend/           # Backend (Express + MongoDB)
└── README.md
```

## 🚀 Quick Start

### 1. Cài đặt MongoDB

**Windows:**
- Tải MongoDB Community Server: https://www.mongodb.com/try/download/community

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Hoặc dùng MongoDB Atlas (Cloud - Miễn phí):**
https://www.mongodb.com/cloud/atlas

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env nếu cần
npm run dev
```

Backend chạy tại: http://localhost:3000

### 3. Seed dữ liệu mặc định

Mở trình duyệt: http://localhost:3000/api/seed

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: http://localhost:5173

## 🎮 Tính năng

### Frontend
- ✅ Vòng quay với 3 lựa chọn: Truth (40%), Dare (40%), Cỏ 3 lá (20%)
- ✅ Animation quay mượt mà với easing
- ✅ Hiệu ứng shuffle và flip card khi bốc bài
- ✅ Quản lý câu hỏi (thêm/xóa)
- ✅ Responsive design
- ✅ Pastel color theme

### Backend
- ✅ RESTful API với Express
- ✅ MongoDB database
- ✅ CRUD operations cho câu hỏi
- ✅ Câu hỏi mặc định không thể xóa
- ✅ CORS enabled

## 📡 API Endpoints

- `GET /api/questions` - Lấy tất cả câu hỏi
- `GET /api/questions/:category` - Lấy câu hỏi theo category
- `POST /api/questions` - Thêm câu hỏi mới
- `DELETE /api/questions/:id` - Xóa câu hỏi
- `POST /api/seed` - Seed câu hỏi mặc định

Chi tiết xem: [Backend README](./backend/README.md)

## 🌐 Deploy

### Frontend (Vercel/Netlify)

1. Build:
```bash
cd frontend
npm run build
```

2. Deploy folder `dist`

3. Cập nhật `API_URL` trong `frontend/src/api.js`:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

### Backend (Railway/Render)

1. Push code lên GitHub
2. Kết nối với MongoDB Atlas
3. Set environment variables:
   - `PORT=3000`
   - `MONGODB_URI=mongodb+srv://...`
4. Deploy

Chi tiết xem:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 🛠️ Tech Stack

### Frontend
- Vite
- Vanilla JavaScript
- Tailwind CSS 4
- Canvas API

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

## 📝 License

MIT

## 👥 Contributing

Pull requests are welcome!
