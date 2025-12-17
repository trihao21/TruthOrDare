# Truth or Dare - Frontend

Frontend cho game Truth or Dare với vòng quay may mắn.

## Cài đặt

```bash
npm install
```

## Cấu hình API

Mở file `src/api.js` và cập nhật `API_URL`:

```javascript
// Development
const API_URL = 'http://localhost:3000/api';

// Production
const API_URL = 'https://your-backend-url.com/api';
```

## Chạy

### Development:
```bash
npm run dev
```
Mở: http://localhost:5173

### Build Production:
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build:
```bash
npm run preview
```

## Tính năng

- ✅ Vòng quay với 3 lựa chọn: Truth (40%), Dare (40%), Cỏ 3 lá (20%)
- ✅ Animation quay mượt mà
- ✅ Hiệu ứng shuffle và flip card
- ✅ Quản lý câu hỏi (thêm/xóa)
- ✅ Responsive design
- ✅ Pastel color theme

## Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

Hoặc:
1. Push code lên GitHub
2. Import project vào Vercel
3. Set environment variable nếu cần
4. Deploy

### Netlify
```bash
npm run build
```
Drag & drop folder `dist` vào Netlify

Hoặc:
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

### GitHub Pages
```bash
npm run build
```
Deploy folder `dist`

## Công nghệ

- Vite
- Vanilla JavaScript
- Tailwind CSS 4
- Canvas API (cho vòng quay)
