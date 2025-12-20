import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { missionAuthService } from '../services/missionAuthService'

function MissionLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.redirectTo || '/mission'
  const [formData, setFormData] = useState({
    username: 'truongtrihao13@gmail.com',
    password: 'truongtrihao13@gmail.com'
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

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      setError('')
      
      // Validate that both fields are the same email
      if (formData.username !== formData.password) {
        setError('Username và Password phải giống nhau (cùng một email)')
        setLoading(false)
        return
      }

      const result = await missionAuthService.login(email)
      
      if (result.success) {
        navigate(redirectTo)
      } else {
        setError(result.error || 'Đăng nhập thất bại')
      }
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    // Both should be email and match
    if (formData.username.trim() !== formData.password.trim()) {
      setError('Username và Password phải giống nhau')
      return
    }

    await handleLogin(formData.username.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D4CEFF] to-[#A1CDED] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] mb-2">
            Đăng Nhập Nhiệm Vụ
          </h1>
          <p className="text-gray-600">
            Đăng nhập để nhận nhiệm vụ bí mật của bạn
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Username)
            </label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4CEFF] focus:border-transparent"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Password)
            </label>
            <input
              type="email"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4CEFF] focus:border-transparent"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.username.trim() || !formData.password}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-bold shadow-lg"
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
    </div>
  )
}

export default MissionLoginPage

