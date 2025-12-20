import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService, utilService } from '../services'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (error) setError('')
    
    // Check password strength
    if (name === 'password') {
      const validation = utilService.validatePassword(value)
      setPasswordStrength(validation.strength)
    }
  }

  const validateForm = () => {
    const errors = []

    if (!formData.username.trim()) {
      errors.push('Tên đăng nhập không được để trống')
    } else if (!utilService.isValidUsername(formData.username)) {
      errors.push('Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới')
    }

    if (!formData.email.trim()) {
      errors.push('Email không được để trống')
    } else if (!utilService.isValidEmail(formData.email)) {
      errors.push('Email không hợp lệ')
    }

    const passwordValidation = utilService.validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp')
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        displayName: formData.displayName.trim() || formData.username.trim()
      }
      
      const result = await authService.register(userData)
      
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Đăng ký thất bại')
      }
    } catch (error) {
      setError(utilService.formatError(error))
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'strong': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Yếu'
      case 'medium': return 'Trung bình'
      case 'strong': return 'Mạnh'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đăng Ký
          </h1>
          <p className="text-gray-600">
            Tạo tài khoản mới để tham gia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="3-20 ký tự, chỉ chữ, số và _"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên hiển thị
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Tên hiển thị (tùy chọn)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ít nhất 6 ký tự"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
              autoComplete="new-password"
            />
            {formData.password && (
              <div className={`text-xs mt-1 ${getPasswordStrengthColor()}`}>
                Độ mạnh: {getPasswordStrengthText()}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage