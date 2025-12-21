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
      <nav className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border-b border-gray-200/50 overflow-hidden" style={{ perspective: '1000px' }}>
        {/* 3D Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Multiple Shadow Layers for 3D Depth */}
        <div className="absolute inset-0 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-16">
            {/* Logo with 3D Effect */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3D Logo Container */}
              <div 
                className="relative transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Shadow Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-full blur-md translate-y-1 translate-z-[-10px] group-hover:translate-y-2 group-hover:blur-lg transition-all duration-300"></div>
                
                {/* Main Logo */}
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(139,92,246,0.4),0_2px_4px_rgba(236,72,153,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transform group-hover:translate-z-[5px] transition-transform duration-300">
                  <span className="text-white font-bold text-base drop-shadow-lg">T</span>
                </div>
                
                {/* Highlight Shine */}
                <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-sm"></div>
              </div>
              
              {/* Text with 3D Effect */}
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transform group-hover:translate-x-1 transition-transform duration-300">
                Truth or Dare
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-3" style={{ transformStyle: 'preserve-3d' }}>
              {/* Only show home link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/" 
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all duration-300 group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 3D Button Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] transform group-hover:translate-y-[-2px] group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300"></div>
                  <span className="relative z-10 transform group-hover:translate-z-[2px] transition-transform duration-300">Trang chủ</span>
                </Link>
              )}
              
              {/* Only show add question link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/add-question" 
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all duration-300 group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] transform group-hover:translate-y-[-2px] group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300"></div>
                  <span className="relative z-10 transform group-hover:translate-z-[2px] transition-transform duration-300">Thêm câu hỏi</span>
                </Link>
              )}
              
              {/* Only show manage link for admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link 
                  to="/manage" 
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all duration-300 group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] transform group-hover:translate-y-[-2px] group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300"></div>
                  <span className="relative z-10 transform group-hover:translate-z-[2px] transition-transform duration-300">Quản lý</span>
                </Link>
              )}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]">
                    {currentUser?.role === 'admin' ? '👑' : '👤'} {currentUser?.displayName || currentUser?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="relative px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 group overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 3D Button Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-lg shadow-[0_4px_12px_rgba(239,68,68,0.4),0_2px_4px_rgba(220,38,38,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transform group-hover:translate-y-[-2px] group-hover:shadow-[0_6px_16px_rgba(239,68,68,0.5),0_4px_8px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] group-active:translate-y-[1px] group-active:shadow-[0_2px_4px_rgba(239,68,68,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200"></div>
                    <span className="relative z-10 transform group-hover:translate-z-[2px] transition-transform duration-300">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="relative px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 group overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 3D Button Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-lg shadow-[0_4px_12px_rgba(139,92,246,0.4),0_2px_4px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transform group-hover:translate-y-[-2px] group-hover:shadow-[0_6px_16px_rgba(139,92,246,0.5),0_4px_8px_rgba(99,102,241,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] group-active:translate-y-[1px] group-active:shadow-[0_2px_4px_rgba(139,92,246,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200"></div>
                    <span className="relative z-10 transform group-hover:translate-z-[2px] transition-transform duration-300">Đăng nhập</span>
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