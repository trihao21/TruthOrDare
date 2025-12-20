# 🎉 Frontend đã được cập nhật để gọi API!

## ✅ Những gì đã hoàn thành:

### 1. **Backend API đã sẵn sàng**
- ✅ Schema mới với `userId`, `type` (thay vì `category`)
- ✅ Controller hỗ trợ backward compatibility
- ✅ API endpoints hoạt động tốt
- ✅ Đã seed 15 câu hỏi mẫu vào database

### 2. **Frontend đã được cập nhật**
- ✅ `App.jsx` gọi API `api.getAllQuestions()` khi load
- ✅ Map dữ liệu từ schema mới (`type`) sang schema cũ (`category`) để UI hoạt động
- ✅ Tự động reload questions sau khi thêm mới

### 3. **Mapping dữ liệu**

Backend trả về:
```json
{
  "_id": "...",
  "userId": "system",
  "type": "truth",  // ← Schema mới
  "content": "Câu hỏi...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Frontend nhận được:
```javascript
{
  _id: "...",
  userId: "system",
  type: "truth",
  category: "TRUTH",  // ← Thêm field này để UI hoạt động
  content: "Câu hỏi...",
  createdAt: "...",
  updatedAt: "..."
}
```

## 🔄 Luồng dữ liệu:

1. **Khi app load:**
   - `App.jsx` gọi `api.getAllQuestions()`
   - Nhận data từ MongoDB
   - Map `type` → `category`
   - Group theo category: TRUTH, DARE, CỎ 3 LÁ
   - Lưu vào state

2. **Khi thêm câu hỏi:**
   - User nhập trong `QuestionInputScreen`
   - Gọi `api.addQuestion(category, content)`
   - Backend map `TRUTH` → `truth`, `DARE` → `dare`, `CỎ 3 LÁ` → `lucky`
   - Lưu vào MongoDB
   - Frontend tự động reload (nếu có callback)

3. **Khi quay vòng quay:**
   - Chọn category (TRUTH/DARE/CỎ 3 LÁ)
   - Lấy questions từ state đã load
   - Random 1 câu hỏi hiển thị

## 🧪 Test API:

### Lấy tất cả câu hỏi:
```bash
curl http://localhost:3000/api/questions
```

### Lấy theo category:
```bash
curl http://localhost:3000/api/questions/TRUTH
curl http://localhost:3000/api/questions/truth
```

### Thêm câu hỏi mới:
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -d '{"category":"TRUTH","content":"Test question"}'
```

### Seed lại dữ liệu:
```bash
curl -X POST http://localhost:3000/api/questions/seed/default
```

## 📝 Lưu ý:

1. **Backend hỗ trợ cả 2 format:**
   - Có thể gửi `category: "TRUTH"` hoặc `type: "truth"`
   - Backend tự động convert

2. **Frontend vẫn dùng tên cũ:**
   - UI components vẫn dùng `TRUTH`, `DARE`, `CỎ 3 LÁ`
   - Mapping layer trong `App.jsx` xử lý việc convert

3. **Không cần thay đổi UI:**
   - Tất cả components khác giữ nguyên
   - Chỉ thay đổi data source từ hardcode → API

## 🎯 Kết quả:

✅ Frontend không còn dùng hardcode data  
✅ Tất cả câu hỏi đều từ MongoDB  
✅ Thêm/xóa câu hỏi real-time  
✅ Backward compatible với code cũ  

Bây giờ app của bạn đã hoàn toàn dynamic! 🚀
