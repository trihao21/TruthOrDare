import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { questionService } from '../services'
import { identityService } from '../services/identityService'
import { authService } from '../services'

function SummaryPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const identity = identityService.getAssignedIdentity()

  const categories = [
    { id: 'truth', label: 'T', color: 'bg-blue-500', fullLabel: 'Sự thật', textColor: 'text-blue-700' },
    { id: 'dare', label: 'D', color: 'bg-red-500', fullLabel: 'Thử thách', textColor: 'text-red-700' }
  ]

  useEffect(() => {
    loadUserQuestions()
  }, [])

  const loadUserQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user
      const currentUser = authService.getCurrentUser()
      // Backend returns 'id' field, not '_id'
      const userId = currentUser?.id || currentUser?._id
      
      if (!currentUser || !userId) {
        // Try to get from identity
        if (!identity) {
          setError('Bạn cần bốc thăm identity để xem câu hỏi của mình')
          setLoading(false)
          return
        }
        
        // Auto-login to get user info
        const username = identityService.getUsernameFromIdentity(identity)
        if (username) {
          try {
            await authService.login(username, '123456')
            // Reload after login
            const updatedUser = authService.getCurrentUser()
            const updatedUserId = updatedUser?.id || updatedUser?._id
            if (updatedUser && updatedUserId) {
              // Convert to string for query
              await fetchUserQuestions(updatedUserId.toString())
            } else {
              setError('Không thể lấy thông tin user')
            }
          } catch (loginError) {
            setError('Không thể đăng nhập để xem câu hỏi')
          }
        } else {
          setError('Không thể xác định tài khoản từ identity')
        }
      } else {
        // Convert to string for query
        await fetchUserQuestions(userId.toString())
      }
    } catch (error) {
      console.error('Error loading user questions:', error)
      setError(error.message || 'Không thể tải câu hỏi')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserQuestions = async (userId) => {
    try {
      // Convert userId to string (in case it's ObjectId)
      const userIdString = userId.toString()
      
      // Use getAllQuestions which now returns only user's questions
      const response = await questionService.getAllQuestions(false)
      setQuestions(response || [])
    } catch (error) {
      console.error('Error fetching user questions:', error)
      // Fallback: getAllQuestions already returns only user's questions, so no need to filter
      try {
        const allQuestions = await questionService.getAllQuestions(false) // Don't use cache
        setQuestions(allQuestions)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        throw error
      }
    }
  }

  const groupedQuestions = questions.reduce((acc, q) => {
    const category = q.type || q.category || 'truth'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(q)
    return acc
  }, {})

  const stats = {
    total: questions.length,
    truth: groupedQuestions.truth?.length || 0,
    dare: groupedQuestions.dare?.length || 0
  }

  const MAX_QUESTIONS_PER_CATEGORY = 10
  const isAtMaxLimit = stats.truth >= MAX_QUESTIONS_PER_CATEGORY && stats.dare >= MAX_QUESTIONS_PER_CATEGORY

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚡</div>
          <p className="text-gray-700 text-lg">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {isAtMaxLimit ? (
            <button
              disabled
              className="inline-block px-6 py-3 bg-gray-400 text-white font-bold rounded-xl cursor-not-allowed opacity-60 shadow-lg"
              title="Bạn đã đạt giới hạn tối đa 10 câu Truth và 10 câu Dare"
            >
              Thêm câu hỏi (Đã đạt giới hạn)
            </button>
          ) : (
            <Link
              to="/add-question"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Thêm câu hỏi
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-6 shadow-xl border border-white/80">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Câu Hỏi Của Tôi
              </h1>
              {identity && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-2xl">{identity.avatar}</span>
                  <span className="font-medium">{identity.displayName}</span>
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-xs text-purple-600 font-medium">Tổng cộng</div>
              </div>
              <div className="text-center px-4 py-2 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{stats.truth}</div>
                <div className="text-xs text-blue-600 font-medium">Truth</div>
              </div>
              <div className="text-center px-4 py-2 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{stats.dare}</div>
                <div className="text-xs text-red-600 font-medium">Dare</div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-xl border border-white/80">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có câu hỏi nào</h2>
            <p className="text-gray-600 mb-6">Bắt đầu thêm câu hỏi của bạn ngay!</p>
            {isAtMaxLimit ? (
              <button
                disabled
                className="inline-block px-6 py-3 bg-gray-400 text-white font-bold rounded-xl cursor-not-allowed opacity-60 shadow-lg"
                title="Bạn đã đạt giới hạn tối đa 10 câu Truth và 10 câu Dare"
              >
                Thêm câu hỏi (Đã đạt giới hạn)
              </button>
            ) : (
              <Link
                to="/add-question"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Thêm câu hỏi
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(category => {
              const categoryQuestions = groupedQuestions[category.id] || []
              if (categoryQuestions.length === 0) return null

              return (
                <div key={category.id} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/80">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {category.label}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{category.fullLabel}</h2>
                      <p className="text-sm text-gray-600">{categoryQuestions.length} câu hỏi</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {categoryQuestions.map((question, index) => (
                      <div
                        key={question._id || index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium leading-relaxed">{question.content}</p>
                            {question.createdAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(question.createdAt).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 text-center">
          {isAtMaxLimit ? (
            <button
              disabled
              className="inline-block px-8 py-4 bg-gray-400 text-white font-bold rounded-xl cursor-not-allowed opacity-60 shadow-lg"
              title="Bạn đã đạt giới hạn tối đa 10 câu Truth và 10 câu Dare"
            >
              ➕ Thêm câu hỏi mới (Đã đạt giới hạn)
            </button>
          ) : (
            <Link
              to="/add-question"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105"
            >
              ➕ Thêm câu hỏi mới
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default SummaryPage

