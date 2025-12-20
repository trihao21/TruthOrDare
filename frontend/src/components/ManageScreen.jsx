import { useState, useEffect } from 'react'
import { api } from '../services'

function ManageScreen({ questions, onBack, onUpdate }) {
  const [currentTab, setCurrentTab] = useState('TRUTH')
  const [newQuestion, setNewQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const currentQuestions = questions[currentTab] || []

  const handleAddQuestion = async () => {
    const content = newQuestion.trim()
    if (!content) return

    setLoading(true)
    try {
      await api.addQuestion(currentTab, content)
      setNewQuestion('')
      await onUpdate()
    } catch (error) {
      alert('Lỗi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestion = async (id) => {
    setLoading(true)
    try {
      await api.deleteQuestion(id)
      await onUpdate()
    } catch (error) {
      alert('Lỗi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddQuestion()
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#B8D4E8] to-[#A4C4D8] p-8 relative overflow-hidden">
      {/* Back Button */}
      <button onClick={onBack} className="back-button">
        <span className="text-xl font-bold text-white">← Quay lại</span>
      </button>

      {/* Title */}
      <h1 className="text-5xl font-black text-center text-white mb-12 mt-8">
        Quản lý câu hỏi
      </h1>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8 justify-center">
          {['TRUTH', 'DARE', 'CỎ 3 LÁ'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`tab-button ${currentTab === tab ? 'active' : ''}`}
            >
              <span className="text-2xl font-bold">{tab}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          {/* Add Question Form */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Thêm câu hỏi mới</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi hoặc thử thách..."
                className="flex-1 px-6 py-4 text-lg rounded-full border-2 border-gray-300 focus:border-purple-400 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={handleAddQuestion}
                disabled={loading || !newQuestion.trim()}
                className="add-question-button disabled:opacity-50"
              >
                <span className="text-xl font-bold text-white">+ Thêm</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Danh sách câu hỏi</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có câu hỏi nào</p>
              ) : (
                currentQuestions.map((q) => (
                  <div key={q._id} className="question-item">
                    <span className="flex-1 text-lg text-gray-700">{q.content}</span>
                    {!q.isDefault ? (
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        disabled={loading}
                        className="delete-question-btn"
                      >
                        <span className="text-red-500 font-bold">✕</span>
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">(Mặc định)</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageScreen
