# Frontend Services Documentation

Tài liệu hướng dẫn sử dụng các service trong ứng dụng Truth or Dare.

## 📁 Cấu trúc Services

```
services/
├── api.js              # HTTP client và API endpoints
├── authService.js      # Quản lý authentication
├── questionService.js  # Quản lý câu hỏi
├── gameService.js      # Logic game và vòng quay
├── canvasService.js    # Vẽ canvas cho vòng quay
├── utilService.js      # Các utility functions
└── index.js           # Export tất cả services
```

## 🔐 Authentication Service

### Sử dụng cơ bản

```javascript
import { authService } from './services';

// Khởi tạo auth state khi app load
await authService.init();

// Đăng ký user mới
const result = await authService.register({
  username: 'user123',
  email: 'user@example.com',
  password: 'password123',
  displayName: 'User Name'
});

if (result.success) {
  console.log('Đăng ký thành công:', result.user);
} else {
  console.error('Lỗi:', result.error);
}

// Đăng nhập
const loginResult = await authService.login('user123', 'password123');

// Đăng xuất
await authService.logout();

// Kiểm tra trạng thái đăng nhập
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log('User hiện tại:', user);
}

// Lắng nghe sự kiện unauthorized
authService.onAuthChange(() => {
  console.log('Session expired, redirect to login');
});
```

## ❓ Question Service

### Quản lý câu hỏi với caching

```javascript
import { questionService } from './services';

// Lấy tất cả câu hỏi (có cache)
const allQuestions = await questionService.getAllQuestions();

// Lấy câu hỏi theo category
const truthQuestions = await questionService.getQuestionsByCategory('truth');
const dareQuestions = await questionService.getQuestionsByCategory('dare');

// Lấy câu hỏi ngẫu nhiên
const randomTruth = await questionService.getRandomQuestion('truth');

// Thêm câu hỏi mới (cần authentication)
const result = await questionService.addQuestion('truth', 'Câu hỏi của bạn?');
if (result.success) {
  console.log('Đã thêm câu hỏi:', result.question);
}

// Xóa câu hỏi (cần authentication)
await questionService.deleteQuestion(questionId);

// Validate câu hỏi trước khi submit
const validation = questionService.validateQuestion(content, category);
if (!validation.isValid) {
  console.error('Lỗi:', validation.errors);
}

// Lấy thống kê câu hỏi
const stats = await questionService.getQuestionStats();
console.log(`Total: ${stats.total}, Truth: ${stats.truth}, Dare: ${stats.dare}`);

// Seed câu hỏi mặc định
await questionService.seedDefaultQuestions();

// Xóa cache thủ công
questionService.clearCache();
```

## 🎮 Game Service

### Logic game và vòng quay

```javascript
import { gameService } from './services';

// Cấu hình segments của vòng quay
console.log(gameService.segments);
// [
//   { label: 'TRUTH', percentage: 40, color: '#B8A4E8', textColor: '#6B4DB8' },
//   { label: 'DARE', percentage: 40, color: '#A4D4E8', textColor: '#4D8DB8' },
//   { label: 'CỎ 3 LÁ', percentage: 20, color: '#D4B8E8', textColor: '#8B4DB8' }
// ]

// Tạo tham số quay ngẫu nhiên
const { totalRotation, duration } = gameService.generateSpinParams();

// Tính kết quả dựa trên góc quay
const result = gameService.calculateResult(totalRotation);
console.log('Kết quả:', result.label);

// Xử lý kết quả và lấy câu hỏi
const spinResult = await gameService.processSpinResult(result);
console.log('Category:', spinResult.category);
console.log('Question:', spinResult.question.content);

// Easing function cho animation
const progress = 0.5; // 0 to 1
const easedProgress = gameService.easeOut(progress);
```

## 🛠️ Utility Service

### Các hàm tiện ích

```javascript
import { utilService } from './services';

// Validate email
if (utilService.isValidEmail('user@example.com')) {
  console.log('Email hợp lệ');
}

// Validate username
if (utilService.isValidUsername('user123')) {
  console.log('Username hợp lệ');
}

// Validate password
const passwordCheck = utilService.validatePassword('myPassword123');
if (passwordCheck.isValid) {
  console.log('Password strength:', passwordCheck.strength); // weak, medium, strong
} else {
  console.error('Errors:', passwordCheck.errors);
}

// Format error messages
const errorMsg = utilService.formatError(error);

// Debounce function
const debouncedSearch = utilService.debounce((query) => {
  console.log('Searching:', query);
}, 300);

// Format date
const formattedDate = utilService.formatDate(new Date());

// Copy to clipboard
const copyResult = await utilService.copyToClipboard('Text to copy');

// Local storage helpers
utilService.storage.set('key', { data: 'value' });
const data = utilService.storage.get('key', defaultValue);
utilService.storage.remove('key');

// Theme management
utilService.theme.init(); // Initialize theme on app load
utilService.theme.set('dark'); // Set theme
const currentTheme = utilService.theme.get(); // Get current theme
utilService.theme.toggle(); // Toggle between light/dark

// Network status
if (utilService.network.isOnline()) {
  console.log('Online');
}

utilService.network.onStatusChange((isOnline) => {
  console.log('Network status:', isOnline ? 'Online' : 'Offline');
});
```

## 🌐 API Service

### Direct API calls (low-level)

```javascript
import { api } from './services';

// Authentication
await api.login(username, password);
await api.register(userData);
await api.logout();
const user = await api.getCurrentUser();

// Questions
const questions = await api.getAllQuestions();
const truthQuestions = await api.getQuestionsByCategory('truth');
await api.addQuestion('truth', 'Question content');
await api.deleteQuestion(questionId);
await api.seedQuestions();

// Check authentication status
if (api.isAuthenticated()) {
  const token = api.getToken();
}
```

## 🎨 Canvas Service

### Vẽ vòng quay

```javascript
import { canvasService } from './services';

// Vẽ vòng quay
canvasService.drawWheel(ctx, centerX, centerY, radius, rotation, segments);

// Vẽ pointer
canvasService.drawPointer(ctx, centerX, centerY, radius);

// Vẽ nút spin
canvasService.drawSpinButton(ctx, centerX, centerY, radius, isSpinning);
```

## 🔄 Event Handling

### Lắng nghe các sự kiện

```javascript
// Auth unauthorized event
window.addEventListener('auth:unauthorized', () => {
  // Redirect to login
  window.location.href = '/login';
});

// Network status events
window.addEventListener('online', () => {
  console.log('Back online');
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
});
```

## ⚙️ Configuration

### Environment Variables

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🔒 Protected Routes

Các API endpoints yêu cầu authentication:
- `POST /questions` - Thêm câu hỏi mới
- `DELETE /questions/:id` - Xóa câu hỏi
- `GET /auth/me` - Lấy thông tin user hiện tại

Token được tự động thêm vào header của mọi request khi user đã đăng nhập.

## 📝 Best Practices

1. **Luôn sử dụng service layer** thay vì gọi API trực tiếp
2. **Xử lý errors** với try-catch và hiển thị thông báo thân thiện
3. **Sử dụng cache** của questionService để giảm số lượng API calls
4. **Validate input** trước khi gửi lên server
5. **Check authentication** trước khi thực hiện các thao tác protected
6. **Clear cache** sau khi thêm/xóa câu hỏi để đảm bảo data mới nhất

## 🐛 Debugging

```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');

// Check token
console.log('Token:', api.getToken());

// Check cache
console.log('Questions cache:', questionService.questionsCache);

// Check auth state
console.log('Current user:', authService.getCurrentUser());
console.log('Is authenticated:', authService.isAuthenticated());
```

## 📚 Examples

Xem các component trong `frontend/src/components/` để biết cách sử dụng services trong thực tế.
