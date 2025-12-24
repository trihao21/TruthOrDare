# Email Configuration Guide

## SMTP Configuration (Recommended)

Thêm các biến môi trường sau vào file `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_REJECT_UNAUTHORIZED=true

# Optional: Custom sender name
EMAIL_FROM_NAME=Hipdam Mission

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173
```

## SMTP Settings for Common Providers

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Lưu ý:** Với Gmail, bạn cần tạo App Password:
1. Vào Google Account Settings
2. Security → 2-Step Verification
3. App Passwords → Generate password cho "Mail"

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_REJECT_UNAUTHORIZED=false
```

## Port Configuration

- **Port 587**: STARTTLS (SMTP_SECURE=false) - Recommended
- **Port 465**: SSL/TLS (SMTP_SECURE=true)
- **Port 25**: Usually blocked by ISPs

## Testing

Sau khi cấu hình, hệ thống sẽ tự động gửi email khi:
- Mission chuyển từ trạng thái `pending` sang `active`
- User đã đăng nhập vào hệ thống mission

## Troubleshooting

1. **Email không gửi được:**
   - Kiểm tra SMTP credentials
   - Kiểm tra firewall/network
   - Kiểm tra logs trong console

2. **Lỗi authentication:**
   - Đảm bảo dùng App Password cho Gmail
   - Kiểm tra username/password chính xác

3. **Lỗi certificate:**
   - Set `SMTP_REJECT_UNAUTHORIZED=false` nếu dùng self-signed certificate






