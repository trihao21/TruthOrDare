import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService, utilService } from '../services'

const defaultAccounts = [
  { username: 'admin', displayName: 'Quản trị viên', role: 'admin', password: 'admin123' },
  { username: 'player1', displayName: 'Người chơi 1', role: 'user', password: '123456' },
  { username: 'player2', displayName: 'Người chơi 2', role: 'user', password: '123456' },
  { username: 'player3', displayName: 'Người chơi 3', role: 'user', password: '123456' },
  { username: 'player4', displayName: 'Người chơi 4', role: 'user', password: '123456' },
  { username: 'player5', displayName: 'Người chơi 5', role: 'user', password: '123456' },
  { username: 'player6', displayName: 'Người chơi 6', role: 'user', password: '123456' },
  { username: 'player7', displayName: 'Người chơi 7', role: 'user', password: '123456' }
]

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

  const handleQuickLogin = async (username, password) => {
    setFormData({ username, password })
    await handleLogin(username, password)
  }

  const handleLogin = async (username, password) => {
    try {
      setLoading(true)
      setError('')
      
      const result = await authService.login(username, password)
      
      if (result.success) {
        navigate(from, { replace: true })
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
            Chọn Người Chơi
          </h1>
          <p className="text-gray-600">
            Chọn tài khoản có sẵn hoặc đăng nhập thủ công
          </p>
        </div>

        {/* Quick Login Buttons */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tài khoản có sẵn:</h3>
          <div className="space-y-2">
            {/* Admin Account */}
            <button
              onClick={() => handleQuickLogin(defaultAccounts[0].username, defaultAccounts[0].password)}
              disabled={loading}
              className="w-full p-3 bg-gradient-to-r from-red-100 to-orange-100 hover:from-red-200 hover:to-orange-200 rounded-lg border-2 border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-red-700">👑 {defaultAccounts[0].displayName}</div>
                  <div className="text-xs text-red-500">@{defaultAccounts[0].username} (ADMIN)</div>
                </div>
                <div className="text-xs text-red-600 font-mono bg-red-50 px-2 py-1 rounded">
                  {defaultAccounts[0].password}
                </div>
              </div>
            </button>
            
            {/* User Accounts */}
            <div className="grid grid-cols-2 gap-2">
              {defaultAccounts.slice(1).map((account) => (
                <button
                  key={account.username}
                  onClick={() => handleQuickLogin(account.username, account.password)}
                  disabled={loading}
                  className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-lg border border-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-sm font-bold text-purple-700">{account.displayName}</div>
                  <div className="text-xs text-purple-500">@{account.username}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            User accounts password: <span className="font-mono bg-gray-100 px-1 rounded">123456</span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập thủ công</span>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

export default LoginPage