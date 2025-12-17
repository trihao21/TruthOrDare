# Truth or Dare - Backend API

Backend API cho game Truth or Dare với MongoDB.

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/truth-or-dare
```

Hoặc dùng MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/truth-or-dare
```

## Chạy

### Development (với auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

## API Endpoints

### Questions

- **GET** `/api/questions` - Lấy tất cả câu hỏi
- **GET** `/api/questions/:category` - Lấy câu hỏi theo category
  - Categories: `TRUTH`, `DARE`, `CỎ 3 LÁ`
  
- **POST** `/api/questions` - Thêm câu hỏi mới
  ```json
  {
    "category": "TRUTH",
    "content": "Câu hỏi của bạn?"
  }
  ```

- **DELETE** `/api/questions/:id` - Xóa câu hỏi
  - Không thể xóa câu hỏi mặc định (`isDefault: true`)

- **POST** `/api/seed` - Seed câu hỏi mặc định vào database

## Database Schema

### Question
```javascript
{
  category: String,      // 'TRUTH' | 'DARE' | 'CỎ 3 LÁ'
  content: String,       // Nội dung câu hỏi
  isDefault: Boolean,    // Câu hỏi mặc định không thể xóa
  createdAt: Date
}
```

## Deploy

### Railway
1. Kết nối GitHub repo
2. Add MongoDB plugin hoặc dùng MongoDB Atlas
3. Set environment variables
4. Deploy

### Render
1. New Web Service
2. Connect repository
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables

### Heroku
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```
