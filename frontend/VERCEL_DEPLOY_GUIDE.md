# Hướng Dẫn Deploy Frontend Lên Vercel

Hướng dẫn chi tiết từng bước để deploy frontend lên Vercel.

## 📋 Yêu Cầu Trước Khi Bắt Đầu

1. ✅ Backend đã deploy trên Render (có URL backend)
2. ✅ Code frontend đã push lên GitHub
3. ✅ Có tài khoản Vercel (đăng ký tại https://vercel.com)

---

## 🚀 Cách 1: Deploy Qua Vercel Dashboard (Khuyến nghị)

### Bước 1: Chuẩn Bị Code

1. **Đảm bảo code đã push lên GitHub:**
   ```bash
   cd frontend
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Bước 2: Đăng Nhập Vercel

1. Truy cập https://vercel.com
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"** để đăng nhập bằng GitHub

### Bước 3: Import Project

1. Trong Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Chọn repository GitHub chứa code frontend
3. Nếu chưa thấy repo, click **"Adjust GitHub App Permissions"** để cấp quyền

### Bước 4: Cấu Hình Project

Trong màn hình **"Configure Project"**, thiết lập:

**Framework Preset:**
- Chọn **"Vite"** (hoặc để Vercel tự detect)

**Root Directory:**
- Nếu repo có cả frontend và backend, chọn: `frontend`
- Nếu chỉ có frontend, để trống

**Build Command:**
```
yarn build
```
hoặc
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
yarn install
```
hoặc
```
npm install
```

### Bước 5: Cấu Hình Environment Variables

**QUAN TRỌNG:** Đây là bước quan trọng nhất!

1. Trong màn hình cấu hình, scroll xuống phần **"Environment Variables"**
2. Click **"Add"** để thêm biến môi trường:

   **Tên biến:** `VITE_API_URL`
   
   **Giá trị:** URL backend của bạn trên Render
   
   Ví dụ:
   ```
   https://your-backend-name.onrender.com/api
   ```
   
   ⚠️ **Lưu ý:**
   - Phải có `/api` ở cuối
   - Phải là HTTPS (không dùng HTTP)
   - Không có dấu `/` ở cuối

3. Click **"Save"**

### Bước 6: Deploy

1. Click nút **"Deploy"**
2. Chờ quá trình build hoàn tất (thường 2-5 phút)
3. Khi build xong, bạn sẽ thấy URL của ứng dụng

### Bước 7: Kiểm Tra

1. Click vào URL được cung cấp
2. Mở Developer Console (F12) → Tab **Network**
3. Kiểm tra xem API calls có thành công không
4. Nếu có lỗi CORS, cần cấu hình CORS trên backend Render

---

## 🔧 Cách 2: Deploy Qua Vercel CLI

### Bước 1: Cài Đặt Vercel CLI

```bash
npm install -g vercel
```

hoặc với yarn:
```bash
yarn global add vercel
```

### Bước 2: Đăng Nhập

```bash
vercel login
```

Chọn phương thức đăng nhập (GitHub, Email, etc.)

### Bước 3: Deploy

```bash
cd frontend
vercel
```

CLI sẽ hỏi một số câu hỏi:

1. **Set up and deploy?** → `Y`
2. **Which scope?** → Chọn tài khoản của bạn
3. **Link to existing project?** → `N` (lần đầu) hoặc `Y` (nếu đã có project)
4. **Project name?** → Nhập tên project (hoặc Enter để dùng tên mặc định)
5. **Directory?** → `./` (nếu đang ở trong thư mục frontend)
6. **Override settings?** → `N` (lần đầu)

### Bước 4: Cấu Hình Environment Variables

Sau khi deploy lần đầu, cấu hình biến môi trường:

```bash
vercel env add VITE_API_URL
```

Nhập giá trị: `https://your-backend-name.onrender.com/api`

Chọn môi trường:
- **Production** → `Y`
- **Preview** → `Y` (nếu muốn dùng cho preview)
- **Development** → `N`

### Bước 5: Deploy Production

```bash
vercel --prod
```

---

## ⚙️ Cấu Hình Nâng Cao

### Tạo File `vercel.json` (Tùy chọn)

Tạo file `vercel.json` trong thư mục `frontend/`:

```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist",
  "devCommand": "yarn dev",
  "installCommand": "yarn install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

File này giúp Vercel hiểu rõ cấu hình project và xử lý routing cho React Router.

### Cấu Hình CORS Trên Backend Render

Nếu gặp lỗi CORS, cần cấu hình trên backend:

1. Vào Render Dashboard
2. Chọn service backend
3. Vào tab **"Environment"**
4. Thêm biến môi trường:

   **Tên:** `CORS_ORIGIN`
   
   **Giá trị:** URL frontend trên Vercel
   
   Ví dụ: `https://your-frontend.vercel.app`

5. Trong code backend, cấu hình CORS:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

---

## 🔍 Troubleshooting

### Lỗi: Build Failed

**Nguyên nhân:**
- Thiếu dependencies
- Lỗi syntax trong code
- Cấu hình build sai

**Giải pháp:**
1. Kiểm tra logs trong Vercel Dashboard
2. Test build local: `yarn build`
3. Kiểm tra `package.json` có đầy đủ dependencies

### Lỗi: API không kết nối được

**Nguyên nhân:**
- `VITE_API_URL` chưa được set
- URL backend sai
- CORS chưa được cấu hình

**Giải pháp:**
1. Kiểm tra Environment Variables trong Vercel
2. Đảm bảo URL có `/api` ở cuối
3. Kiểm tra CORS trên backend

### Lỗi: 404 khi refresh trang

**Nguyên nhân:**
- React Router cần rewrite rules

**Giải pháp:**
- Tạo file `vercel.json` với rewrite rules (xem phần trên)

### Lỗi: Module not found

**Nguyên nhân:**
- Package manager không đúng

**Giải pháp:**
1. Trong Vercel Dashboard → Settings → General
2. Chọn đúng **Package Manager**: `yarn` hoặc `npm`

---

## 📝 Checklist Trước Khi Deploy

- [ ] Code đã push lên GitHub
- [ ] Backend đã deploy và có URL
- [ ] Đã test build local: `yarn build`
- [ ] Đã chuẩn bị URL backend cho `VITE_API_URL`
- [ ] Đã cấu hình CORS trên backend
- [ ] Đã tạo tài khoản Vercel

---

## 🎯 Sau Khi Deploy

1. **Kiểm tra URL:** Truy cập URL được cung cấp
2. **Test chức năng:** Đăng nhập, thêm câu hỏi, etc.
3. **Kiểm tra Console:** Mở F12 → Console để xem lỗi
4. **Kiểm tra Network:** Xem API calls có thành công không

---

## 🔄 Update Deployment

Mỗi khi push code mới lên GitHub:

**Nếu dùng GitHub Integration:**
- Vercel tự động deploy khi có commit mới
- Vào Vercel Dashboard để xem status

**Nếu dùng CLI:**
```bash
vercel --prod
```

---

## 📚 Tài Liệu Tham Khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Tips

1. **Custom Domain:** Có thể thêm domain riêng trong Vercel Settings
2. **Preview Deployments:** Mỗi PR sẽ có preview URL riêng
3. **Analytics:** Bật Vercel Analytics để theo dõi performance
4. **Environment:** Có thể set biến môi trường khác nhau cho Production/Preview

---

Chúc bạn deploy thành công! 🚀

