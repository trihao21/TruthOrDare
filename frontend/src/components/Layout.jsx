import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services'

function Layout({ children }) {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAuthenticated = authService.isAuthenticated()

  const handleLogout = async () => {
    await authService.logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Truth or Dare</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {/* Only show home link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Trang chủ
                </Link>
              )}
              
              {/* Only show add question link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/add-question" 
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Thêm câu hỏi
                </Link>
              )}
              
              {/* Only show manage link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/manage" 
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Quản lý
                </Link>
              )}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {currentUser?.role === 'admin' ? '👑' : '👤'} {currentUser?.displayName || currentUser?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout