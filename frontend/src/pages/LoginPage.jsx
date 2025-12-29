import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService, utilService, identityService } from '../services'
import TourGuide from '../components/TourGuide'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (error) setError('')
  }

  const handleLogin = async (username, password) => {
    try {
      setLoading(true)
      setError('')
      
      const result = await authService.login(username, password)
      
      if (result.success) {
        // Check if this username matches player pattern (player1, player2, etc.)
        // Player accounts are always created from identity assignment, so redirect to add-question
        const isPlayerAccount = /^player\d+$/.test(username.toLowerCase())
        
        if (isPlayerAccount) {
          // Try to sync identity from backend (based on deviceId)
          // This ensures identity is available in localStorage for the app to use
          try {
            await identityService.getCurrentIdentityFromBackend()
          } catch (error) {
            console.error('Error syncing identity from backend:', error)
            // Continue anyway - identity might be in localStorage already
          }
          
          // Always redirect player accounts to add-question
          navigate('/add-question', { replace: true })
          return
        }
        
        // For non-player accounts, check if there's an identity assigned in localStorage
        const assignedIdentity = identityService.getAssignedIdentity()
        
        // If user has identity, redirect to add-question
        if (assignedIdentity) {
          navigate('/add-question', { replace: true })
        } else {
          // Otherwise redirect to the original destination or home
          navigate(from, { replace: true })
        }
      } else {
        setError(result.error || 'Đăng nhập thất bại')
      }
    } catch (error) {
      setError(utilService.formatError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    await handleLogin(formData.username.trim(), formData.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đăng nhập
            Đăng nhập
          </h1>
         
        </div>

        {/* Quick Login Buttons */}
    

        {/* Divider */}
      

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" data-tour="login-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              autoComplete="username"
              data-tour="login-username-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              autoComplete="current-password"
              data-tour="login-password-input"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.username.trim() || !formData.password}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            data-tour="login-submit-button"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>

      {/* Tour Guide */}
      <TourGuide
        tourName="login"
        steps={[
          {
            target: '[data-tour="login-form"]',
            content: 'Nhập tên đăng nhập và mật khẩu của bạn để đăng nhập vào hệ thống.',
            allowClickOutside: false
          },
          {
            target: '[data-tour="login-submit-button"]',
            content: 'Sau khi nhập đầy đủ thông tin, nhấn nút "Đăng nhập" để bắt đầu trải nghiệm.',
            allowClickOutside: false
          }
        ]}
        onComplete={() => {}}
      />
    </div>
  )
}

export default LoginPage