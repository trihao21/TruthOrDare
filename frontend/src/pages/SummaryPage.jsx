import { useState, useEffect } from 'react'
import { submittedQuestionsService } from '../services/submittedQuestionsService'

function SummaryPage() {
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const allSubmissions = submittedQuestionsService.getAll()
    setSubmissions(allSubmissions)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'truth': 'Sự thật (T)',
      'dare': 'Thử thách (D)'
    }
    return labels[category] || category
  }

  const getCategoryColor = (category) => {
    return category === 'truth' ? 'bg-blue-500' : 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            Tóm tắt câu hỏi đã gửi
          </h1>
          <p className="text-gray-600 text-sm">
            Tổng số lần gửi: {submissions.length}
          </p>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg">Chưa có câu hỏi nào được gửi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-lg"
              >
                {/* Submission Header */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Gửi lúc: {formatDate(submission.timestamp)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {submission.questions.length} câu hỏi
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                  {submission.questions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-gray-200"
                    >
                      <div className={`w-8 h-8 rounded-lg ${getCategoryColor(question.category)} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                        {question.category === 'truth' ? 'T' : 'D'}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">
                          {getCategoryLabel(question.category)}
                        </div>
                        <div className="text-gray-800 text-sm">
                          {question.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SummaryPage

