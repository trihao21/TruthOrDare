import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { submittedQuestionsService, identityService } from '../services'

function Layout({ children }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasSubmittedQuestions, setHasSubmittedQuestions] = useState(false)
  const [myIdentity, setMyIdentity] = useState(null)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    // Khởi tạo identity service
    identityService.initialize()

    const checkSubmittedQuestions = () => {
      const submissions = submittedQuestionsService.getAll()
      setHasSubmittedQuestions(submissions.length > 0)
    }

    const checkIdentity = () => {
      const identity = identityService.getMyIdentity()
      setMyIdentity(identity)
    }

    checkSubmittedQuestions()
    checkIdentity()
    
    // Check periodically in case submissions are added from another tab
    const interval = setInterval(() => {
      checkSubmittedQuestions()
      checkIdentity()
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
            </div>

            {/* Desktop Actions Section */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-3">
              {/* Add Question button - always visible */}
              <Link 
                to="/add-question" 
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  isActive('/add-question')
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                ➕ Thêm câu hỏi
              </Link>

              {/* Identity Display - if drawn */}
              {myIdentity && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                  <span className="text-xl">{myIdentity.avatar}</span>
                  <span className="text-xs md:text-sm font-medium">
                    {myIdentity.colorName}
                  </span>
                </div>
              )}

              {/* Join button - if not drawn yet */}
              {!myIdentity && (
                <Link 
                  to="/" 
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                  }`}
                >
                  🎭 Tham gia
                </Link>
              )}

              {/* Timeline button */}
              <Link 
                to="/timeline" 
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Timeline
              </Link>
              
              {/* Summary button - only show if user has submitted questions */}
              {hasSubmittedQuestions && (
                <Link 
                  to="/summary" 
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    isActive('/summary')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                  }`}
                >
                  Tóm tắt
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              <Link 
                to="/add-question" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
                  isActive('/add-question') 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                ➕ Thêm câu hỏi
              </Link>
              
              {/* Identity Display - if drawn */}
              {myIdentity && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <span className="text-xl">{myIdentity.avatar}</span>
                  <span className="text-sm font-medium">
                    Player {myIdentity.colorName}
                  </span>
                </div>
              )}

              {/* Join button - if not drawn yet */}
              {!myIdentity && (
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                  }`}
                >
                  🎭 Tham gia
                </Link>
              )}

              <Link 
                to="/timeline" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-center"
              >
                Timeline
              </Link>
              
              {hasSubmittedQuestions && (
                <Link 
                  to="/summary" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
                    isActive('/summary')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                  }`}
                >
                  Tóm tắt
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
    </div>
  )
}

export default Layout