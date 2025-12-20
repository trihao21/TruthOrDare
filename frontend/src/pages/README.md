# Pages Documentation

Tài liệu về các trang trong ứng dụng Truth or Dare với React Router.

## 📁 Cấu trúc Pages

```
pages/
├── HomePage.jsx          # Trang chủ với vòng quay
├── AddQuestionPage.jsx   # Trang thêm câu hỏi mới
├── ManagePage.jsx        # Trang quản lý câu hỏi
├── LoginPage.jsx         # Trang đăng nhập
├── RegisterPage.jsx      # Trang đăng ký
└── NotFoundPage.jsx      # Trang 404
```

## 🌐 URL Routes

### Public Routes (không cần đăng nhập)
- `/` - Trang chủ với vòng quay
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký

### Protected Routes (cần đăng nhập)
- `/add-question` - Thêm câu hỏi mới
- `/manage` - Quản lý câu hỏi (xem, xóa)

### Special Routes
- `*` - Trang 404 cho URL không tồn tại

## 🏠 HomePage (`/`)

Trang chủ chứa vòng quay chính của game.

**Features:**
- Vòng quay với 3 segments: Truth, Dare, Cỏ 3 lá
- Animation mượt mà khi quay
- Hiển thị kết quả và câu hỏi
- Navigation qua Layout component

**Props:**
- `questions` - Object chứa câu hỏi theo category
- `onQuestionsUpdate` - Function để reload câu hỏi

## ➕ AddQuestionPage (`/add-question`)

Trang thêm câu hỏi mới với form validation.

**Features:**
- Form thêm câu hỏi với category selection
- Real-time validation
- Character counter (500 ký tự max)
- Authentication check
- Success/error messages
- Auto redirect sau khi thêm thành công

**Authentication:**
- Yêu cầu đăng nhập
- Hiển thị thông báo nếu chưa đăng nhập
- Link đến trang login

## ⚙️ ManagePage (`/manage`)

Trang quản lý câu hỏi (wrapper cho ManageScreen component).

**Features:**
- Xem danh sách câu hỏi
- Xóa câu hỏi (cần authentication)
- Filter theo category
- Pagination

## 🔐 LoginPage (`/login`)

Trang đăng nhập với form validation.

**Features:**
- Login form với username/email và password
- Form validation
- Remember return URL (redirect về trang trước đó)
- Link đến register page
- Error handling

**URL Parameters:**
- `state.from` - URL để redirect sau khi đăng nhập thành công

## 📝 RegisterPage (`/register`)

Trang đăng ký tài khoản mới.

**Features:**
- Registration form với validation
- Password strength indicator
- Email validation
- Username validation (3-20 chars, alphanumeric + underscore)
- Confirm password matching
- Auto login sau khi đăng ký thành công

## ❌ NotFoundPage (`*`)

Trang 404 cho URL không tồn tại.

**Features:**
- Friendly 404 message
- Link về trang chủ
- Responsive design

## 🛡️ Authentication Flow

### Protected Routes
Các route cần authentication sử dụng ProtectedRoute component:

```jsx
<ProtectedRoute requireAuth={true}>
  <AddQuestionPage />
</ProtectedRoute>
```

### Login Flow
1. User truy cập protected route
2. Redirect đến `/login` với `state.from`
3. Sau khi login thành công, redirect về `state.from` hoặc `/`

### Register Flow
1. User đăng ký tài khoản mới
2. Auto login sau khi đăng ký thành công
3. Redirect về trang chủ

## 🎨 Layout System

### With Layout
Các trang sử dụng Layout component (có navigation bar):
- HomePage
- AddQuestionPage  
- ManagePage
- NotFoundPage

### Without Layout
Các trang full-screen (không có navigation):
- LoginPage
- RegisterPage

## 📱 Responsive Design

Tất cả pages đều responsive với:
- Mobile-first approach
- Tailwind CSS classes
- Flexible layouts
- Touch-friendly buttons

## 🔄 State Management

### Global State (App level)
- `questions` - Câu hỏi được load từ API
- `loading` - Trạng thái loading
- `error` - Error messages

### Local State (Page level)
- Form data
- Loading states
- Error messages
- UI states

## 🚀 Navigation

### Programmatic Navigation
```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Navigate to home
navigate('/')

// Navigate with replace (không thêm vào history)
navigate('/login', { replace: true })

// Navigate with state
navigate('/login', { state: { from: location } })
```

### Link Navigation
```jsx
import { Link } from 'react-router-dom'

<Link to="/add-question">Thêm câu hỏi</Link>
```

## 🔧 URL Structure

```
https://yourapp.com/
├── /                    # Trang chủ
├── /add-question        # Thêm câu hỏi
├── /manage             # Quản lý câu hỏi
├── /login              # Đăng nhập
├── /register           # Đăng ký
└── /any-invalid-url    # 404 page
```

## 📊 SEO & Meta Tags

Có thể thêm React Helmet để quản lý meta tags:

```jsx
import { Helmet } from 'react-helmet'

<Helmet>
  <title>Truth or Dare - Thêm câu hỏi</title>
  <meta name="description" content="Thêm câu hỏi mới cho trò chơi Truth or Dare" />
</Helmet>
```

## 🐛 Error Handling

### Page Level Errors
- Form validation errors
- API call errors
- Authentication errors

### Global Error Boundary
Có thể thêm Error Boundary để catch JavaScript errors:

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 🔄 Loading States

### Page Loading
- Skeleton screens
- Loading spinners
- Progress indicators

### Form Loading
- Disabled buttons
- Loading text
- Prevent double submission

## 📝 Best Practices

1. **URL Design**: Sử dụng kebab-case cho URLs (`/add-question`)
2. **Authentication**: Check auth state trước khi render protected content
3. **Error Handling**: Hiển thị error messages thân thiện
4. **Loading States**: Luôn có loading state cho async operations
5. **Form Validation**: Validate cả client-side và server-side
6. **Responsive**: Test trên nhiều screen sizes
7. **Accessibility**: Sử dụng semantic HTML và ARIA labels