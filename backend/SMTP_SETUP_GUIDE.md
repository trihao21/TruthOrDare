# Hướng Dẫn Cấu Hình SMTP Chi Tiết

## Bước 1: Tạo File .env

1. Vào thư mục `backend`
2. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
   Hoặc tạo file `.env` mới

## Bước 2: Lấy Các Giá Trị Cấu Hình

### 1. SMTP_HOST
**Giá trị:** `smtp.gmail.com`

Đây là địa chỉ SMTP server của Gmail. Không cần thay đổi nếu dùng Gmail.

**Các giá trị khác:**
- Gmail: `smtp.gmail.com`
- Outlook: `smtp-mail.outlook.com`
- Yahoo: `smtp.mail.yahoo.com`

### 2. SMTP_PORT
**Giá trị:** `587`

Port 587 dùng STARTTLS (khuyến nghị). Không cần thay đổi.

**Các port khác:**
- `587`: STARTTLS (SMTP_SECURE=false) - **Khuyến nghị**
- `465`: SSL/TLS (SMTP_SECURE=true)

### 3. SMTP_SECURE
**Giá trị:** `false`

Vì dùng port 587 (STARTTLS), đặt là `false`. Nếu dùng port 465 thì đặt `true`.

### 4. SMTP_USER
**Giá trị:** Email Gmail của bạn

Ví dụ: `truongtrihao13@gmail.com`

**Cách lấy:**
- Đây chính là địa chỉ email Gmail của bạn
- Thay `your-email@gmail.com` bằng email thật của bạn

### 5. SMTP_PASSWORD
**Giá trị:** App Password của Gmail (KHÔNG phải mật khẩu thường)

**⚠️ QUAN TRỌNG:** Bạn KHÔNG thể dùng mật khẩu Gmail thông thường. Phải tạo App Password.

**Cách tạo App Password cho Gmail:**

#### Bước 1: Bật 2-Step Verification
1. Vào [Google Account](https://myaccount.google.com/)
2. Chọn **Security** (Bảo mật)
3. Tìm **2-Step Verification** (Xác minh 2 bước)
4. Bật tính năng này (nếu chưa bật)
   - Có thể cần xác minh số điện thoại

#### Bước 2: Tạo App Password
1. Vẫn trong trang **Security**
2. Tìm **App passwords** (Mật khẩu ứng dụng)
   - Nếu không thấy, tìm trong **2-Step Verification** → **App passwords**
3. Chọn **Select app** → Chọn **Mail**
4. Chọn **Select device** → Chọn **Other (Custom name)**
5. Nhập tên: `Hipdam Mission` hoặc tên bất kỳ
6. Click **Generate** (Tạo)
7. **Copy mật khẩu 16 ký tự** được tạo ra (ví dụ: `abcd efgh ijkl mnop`)
   - ⚠️ **Lưu ý:** Chỉ hiển thị 1 lần, hãy copy ngay!

#### Bước 3: Sử dụng App Password
- Dán mật khẩu 16 ký tự vào `SMTP_PASSWORD` trong file `.env`
- Có thể bỏ khoảng trắng hoặc giữ nguyên đều được

**Ví dụ:**
```env
SMTP_PASSWORD=abcdefghijklmnop
```
hoặc
```env
SMTP_PASSWORD=abcd efgh ijkl mnop
```

### 6. FRONTEND_URL
**Giá trị:** URL của frontend application

**Cho development:**
```env
FRONTEND_URL=http://localhost:5173
```

**Cho production:**
```env
FRONTEND_URL=https://yourdomain.com
```

## Bước 3: Ví Dụ File .env Hoàn Chỉnh

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=truongtrihao13@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_REJECT_UNAUTHORIZED=true

# Optional
EMAIL_FROM_NAME=Hipdam Mission
FRONTEND_URL=http://localhost:5173
```

## Bước 4: Kiểm Tra

1. Đảm bảo file `.env` nằm trong thư mục `backend`
2. Không commit file `.env` lên Git (đã có trong .gitignore)
3. Restart backend server sau khi thay đổi `.env`

## Troubleshooting

### Lỗi: "Invalid login"
- Kiểm tra lại App Password (không phải mật khẩu thường)
- Đảm bảo đã bật 2-Step Verification

### Lỗi: "Connection timeout"
- Kiểm tra firewall
- Thử port 465 với SMTP_SECURE=true

### Không thấy "App passwords"
- Đảm bảo đã bật 2-Step Verification trước
- Có thể cần đợi vài phút sau khi bật

## Lưu Ý Bảo Mật

- ⚠️ **KHÔNG** commit file `.env` lên Git
- ⚠️ **KHÔNG** chia sẻ App Password
- ⚠️ Nếu App Password bị lộ, hãy xóa và tạo lại ngay




