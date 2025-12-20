import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'

function RoleBasedRedirect({ children }) {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // If user is not admin, redirect to add-question page
      if (currentUser.role !== 'admin') {
        navigate('/add-question', { replace: true })
      }
    }
  }, [isAuthenticated, currentUser, navigate])

  // If user is authenticated but not admin, don't render children
  if (isAuthenticated && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang chuyển hướng...</h2>
          <p className="text-gray-600">Bạn sẽ được chuyển đến trang thêm câu hỏi</p>
        </div>
      </div>
    )
  }

  return children
}

export default RoleBasedRedirect