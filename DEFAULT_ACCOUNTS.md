# 🎮 Tài Khoản Mặc Định - Truth or Dare Game

## 📋 Danh Sách Tài Khoản

Ứng dụng đã được cấu hình với 1 tài khoản admin và 7 tài khoản user:

### 👑 Admin Account
| Tên Hiển Thị | Username | Password | Email | Role |
|---------------|----------|----------|-------|------|
| Quản trị viên | `admin` | `admin123` | admin@game.com | admin |

### 👤 User Accounts
| Tên Hiển Thị | Username | Password | Email | Role |
|---------------|----------|----------|-------|------|
| Người chơi 1 | `player1` | `123456` | player1@game.com | user |
| Người chơi 2 | `player2` | `123456` | player2@game.com | user |
| Người chơi 3 | `player3` | `123456` | player3@game.com | user |
| Người chơi 4 | `player4` | `123456` | player4@game.com | user |
| Người chơi 5 | `player5` | `123456` | player5@game.com | user |
| Người chơi 6 | `player6` | `123456` | player6@game.com | user |
| Người chơi 7 | `player7` | `123456` | player7@game.com | user |

## 🔐 Phân Quyền

### 👑 Admin (`admin`):
- ✅ Truy cập tất cả trang
- ✅ Chơi game vòng quay
- ✅ Thêm câu hỏi mới
- ✅ Quản lý câu hỏi (xem, xóa)
- ✅ Xem thống kê câu hỏi
- ✅ Truy cập trang quản lý

### 👤 User (`player1-7`):
- ✅ Thêm câu hỏi mới (chỉ có quyền này)
- ❌ Không thể chơi game vòng quay
- ❌ Không thể xóa câu hỏi
- ❌ Không thể truy cập trang quản lý
- ❌ Tự động redirect đến `/add-question` khi đăng nhập

## 🚀 Cách Sử Dụng

### 1. Đăng Nhập Admin
- Click nút "👑 Quản trị viên" (màu đỏ)
- Hoặc nhập: Username: `admin`, Password: `admin123`
- Có thể truy cập tất cả tính năng

### 2. Đăng Nhập User
- Click một trong 7 nút "Người chơi X" (màu tím)
- Hoặc nhập: Username: `player1-7`, Password: `123456`
- Sẽ được redirect đến trang thêm câu hỏi

## 🎯 Luồng Hoạt Động

### Admin Flow:
1. Đăng nhập → Trang chủ
2. Có thể chơi game hoặc quản lý
3. Navigation đầy đủ: Trang chủ | Thêm câu hỏi | Quản lý

### User Flow:
1. Đăng nhập → Auto redirect đến `/add-question`
2. Chỉ có thể thêm câu hỏi
3. Navigation giới hạn: Trang chủ | Thêm câu hỏi (không có Quản lý)
4. Nếu truy cập trang chủ → Auto redirect về `/add-question`

## 🎨 Giao Diện Đăng Nhập

- **Admin button**: Màu đỏ, hiển thị password, có icon 👑
- **User buttons**: Màu tím, grid 2 cột
- **Role indicator**: Admin có 👑, User có 👤 trong navigation

## 🔧 Backend API Changes

### Protected Endpoints:
- `POST /api/questions` - Cần authentication (cả admin và user)
- `DELETE /api/questions/:id` - Chỉ admin
- `GET /api/auth/me` - Cần authentication

### Response Changes:
- Login/Register response bao gồm `role` field
- User object có `role: 'admin' | 'user'`

## 🛠️ Tạo Lại Tài Khoản

```bash
cd backend
npm run create-users
```

## 📱 Frontend Role Management

### AuthService:
```javascript
authService.isAdmin() // Check if current user is admin
authService.getCurrentUser().role // Get user role
```

### Components:
- `RoleBasedRedirect`: Auto redirect users to add-question
- `Layout`: Hide/show navigation based on role
- Conditional rendering based on user role

## 🔒 Security Features

- JWT tokens include user role
- Backend middleware validates admin access
- Frontend route protection
- Automatic redirects for unauthorized access

---

**Admin Access: `admin` / `admin123`**  
**User Access: `player1-7` / `123456`**