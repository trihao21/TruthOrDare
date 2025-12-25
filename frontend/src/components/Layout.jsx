import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services'
import SecretMissionPopup from './SecretMissionPopup'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = authService.getCurrentUser()
  const isAuthenticated = authService.isAuthenticated()
  const [showSecretMission, setShowSecretMission] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await authService.logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg md:text-xl drop-shadow-lg">T</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                Truth or Dare
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Only show home link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-purple-600 bg-purple-50 font-semibold' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Trang chủ
                </Link>
              )}
              
              {/* Only show add question link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/add-question" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/add-question') 
                      ? 'text-purple-600 bg-purple-50 font-semibold' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Thêm câu hỏi
                </Link>
              )}
              
              {/* Only show manage link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/manage" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/manage') 
                      ? 'text-purple-600 bg-purple-50 font-semibold' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Quản lý
                </Link>
              )}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Timeline button - visible to all authenticated users */}
                  <Link 
                    to="/timeline" 
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Timeline
                  </Link>
                  
                  {/* Secret Mission Button (for testing) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowSecretMission(true)
                    }}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    title="Mở Secret Mission (Test)"
                    type="button"
                  >
                    <span className="hidden sm:inline">🎯 </span>Secret
                  </button>
                  
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm">{currentUser?.role === 'admin' ? '👑' : '👤'}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser?.displayName || currentUser?.username}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-purple-600 bg-purple-50 font-semibold' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Trang chủ
                </Link>
              )}
              
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/add-question" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/add-question') 
                      ? 'text-purple-600 bg-purple-50 font-semibold' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Thêm câu hỏi
                </Link>
              )}
              
              {isAuthenticated && (
                <Link 
                  to="/timeline" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-center"
                >
                  Timeline
                </Link>
              )}
              
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/manage" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/manage') 
                      ? 'text-purple-600 bg-purple-50 font-semibold' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Quản lý
                </Link>
              )}

              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowSecretMission(true)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    🎯 Secret Mission
                  </button>
                  
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span>{currentUser?.role === 'admin' ? '👑' : '👤'}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {currentUser?.displayName || currentUser?.username}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-center"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Secret Mission Popup */}
      {showSecretMission && (
        <SecretMissionPopup 
          onClose={() => {
            console.log('Closing Secret Mission popup')
            setShowSecretMission(false)
          }} 
        />
      )}
    </div>
  )
}

export default Layout