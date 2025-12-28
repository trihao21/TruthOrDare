import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { questionService, authService } from '../services'
import { identityService } from '../services/identityService'
import TourGuide from '../components/TourGuide'
import { tourService } from '../services/tourService'

// Helper for generating unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

function AddQuestionPage() {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const [rows, setRows] = useState([
    { id: generateId(), content: '', category: 'truth', isNew: false, errors: [] }
  ])
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const categories = [
    { id: 'truth', label: 'T', color: 'bg-blue-500', fullLabel: 'Sự thật' },
    { id: 'dare', label: 'D', color: 'bg-red-500', fullLabel: 'Thử thách' }
  ]

  const handleAddRow = () => {
    setRows([...rows, { id: generateId(), content: '', category: 'truth', isNew: true, errors: [] }])
    
    // Smooth scroll to bottom after a short delay to let the new row render
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 150)
  }

  const handleDeleteRow = (id) => {
    if (rows.length === 1) {
      // Don't delete the last row, just clear it
      setRows([{ id: generateId(), content: '', category: 'truth', isNew: false, errors: [] }])
      return
    }
    setRows(rows.filter(r => r.id !== id))
  }

  const updateRow = (id, field, value) => {
    setRows(rows.map(r => {
      if (r.id === id) {
        const updatedRow = { ...r, [field]: value }
        
        // Validate content in real-time
        if (field === 'content') {
          const validation = questionService.validateQuestion(value, r.category)
          updatedRow.errors = validation.errors
        }
        
        return updatedRow
      }
      return r
    }))
    
    // Clear global error when user starts typing
    if (globalError) {
      setGlobalError('')
    }
  }

  const handleSubmit = async () => {
    // Check identity (bốc thăm = đăng nhập)
    const hasIdentity = identityService.hasIdentity()
    if (!hasIdentity) {
      setGlobalError('Bạn cần bốc thăm identity trước khi thêm câu hỏi')
      setShowErrorModal(true)
      return
    }

    // Validate all rows first
    let hasErrors = false
    const validatedRows = rows.map(row => {
      const validation = questionService.validateQuestion(row.content, row.category)
      if (!validation.isValid) {
        hasErrors = true
      }
      return { ...row, errors: validation.errors }
    })

    // Update rows with validation errors
    setRows(validatedRows)

    if (hasErrors) {
      setGlobalError('Vui lòng sửa các lỗi trước khi gửi')
      setShowErrorModal(true)
      return
    }

    // Filter valid rows (non-empty content)
    const validRows = validatedRows.filter(r => r.content.trim())

    if (validRows.length === 0) {
      setGlobalError('Vui lòng nhập ít nhất một câu hỏi')
      setShowErrorModal(true)
      return
    }

    // Check minimum requirements: at least 10 truth and 10 dare
    // Temporarily disabled for testing
    /*
    const truthCount = validRows.filter(r => r.category === 'truth').length
    const dareCount = validRows.filter(r => r.category === 'dare').length

    const missingTruth = 10 - truthCount
    const missingDare = 10 - dareCount

    if (truthCount < 10 || dareCount < 10) {
      let errorMessage = 'Cần đáp ứng yêu cầu tối thiểu:\n\n'
      
      if (truthCount < 10) {
        errorMessage += `• Cần ít nhất 10 câu hỏi Truth (hiện tại: ${truthCount}, còn thiếu: ${missingTruth})\n`
      } else {
        errorMessage += `• Truth: ${truthCount}/10 ✓\n`
      }
      
      if (dareCount < 10) {
        errorMessage += `• Cần ít nhất 10 câu hỏi Dare (hiện tại: ${dareCount}, còn thiếu: ${missingDare})`
      } else {
        errorMessage += `• Dare: ${dareCount}/10 ✓`
      }
      
      setGlobalError(errorMessage)
      setShowErrorModal(true)
      return
    }
    */

    setLoading(true)
    setGlobalError('')
    
    try {
      // Submit all valid rows in parallel
      const results = await Promise.all(
        validRows.map(row => questionService.addQuestion(row.category, row.content.trim()))
      )

      // Check results and collect detailed errors
      const failedSubmissions = results.filter(result => !result.success)
      
      if (failedSubmissions.length > 0) {
        const errorMessages = failedSubmissions.map(result => result.error).join(', ')
        throw new Error(`Không thể thêm một số câu hỏi: ${errorMessages}`)
      }

      // Show success message
      setShowSuccessModal(true)
      // Reset to one empty row
      setRows([{ id: generateId(), content: '', category: 'truth', isNew: false, errors: [] }])
    } catch (error) {
      console.error('Submit error:', error)
      setGlobalError(error.message || 'Gửi câu hỏi thất bại. Vui lòng thử lại.')
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="fixed inset-0 h-screen w-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] p-4 flex flex-col items-center relative overflow-hidden font-sans">

      {/* Back Button & Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4 pt-2 relative">
        <button
          onClick={handleBack}
          className="group relative z-10"
        >
          <div className="relative transform transition-transform active:scale-95 duration-150">
            <div className="absolute inset-0 bg-gray-400 rounded-full translate-y-1"></div>
           
          </div>
        </button>

        <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 drop-shadow-sm absolute left-1/2 -translate-x-1/2 text-center w-full pointer-events-none">
          Thêm Câu Hỏi
        </h1>

        {/* Info Button */}
        <button
          onClick={() => setShowInfo(true)}
          className="group relative z-10"
        >
          <div className="relative transform transition-transform active:scale-95 duration-150">
            <div className="absolute inset-0 bg-blue-400 rounded-full translate-y-1"></div>
            <div className="relative bg-white border-2 border-blue-200 w-8 h-8 rounded-full font-black text-blue-500 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-sm">
              i
            </div>
          </div>
        </button>
      </div>

      {/* Identity Check */}
      {!identityService.hasIdentity() && (
        <div className="w-full max-w-3xl mb-4">
          <div className="bg-yellow-100/80 backdrop-blur-xl border border-yellow-400/50 text-yellow-700 px-4 py-3 rounded-2xl shadow-lg">
            <p className="text-sm font-medium text-center">
              Bạn cần bốc thăm identity trước khi thêm câu hỏi.{' '}
              <button
                onClick={() => navigate('/')}
                className="text-yellow-800 underline font-bold"
              >
                Bốc thăm ngay
              </button>
            </p>
          </div>
        </div>
      )}


      {/* Main Container */}
      <div className="w-full max-w-3xl perspective-1000 flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-4 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.5)] min-h-0">

          {/* Scrollable list */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className={`group relative question-row ${row.isNew ? 'animate-fade-in-up' : ''}`}
                onAnimationEnd={() => {
                  // Remove isNew flag after animation completes
                  if (row.isNew) {
                    setRows(prevRows => 
                      prevRows.map(r => r.id === row.id ? { ...r, isNew: false } : r)
                    )
                  }
                }}
              >
                {/* Main row with input and delete button */}
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Number */}
                  <div className="hidden md:flex items-center justify-center w-8 h-12 text-gray-400 font-bold">
                    {index + 1}
                  </div>

                  {/* Input Container */}
                  <div className={`flex-1 rounded-xl p-2 shadow-sm transition-all ${
                    row.errors.length > 0 
                      ? 'bg-red-50 border-2 border-red-300' 
                      : 'bg-white border border-gray-100 focus-within:shadow-md focus-within:border-purple-300'
                  }`}>
                    <div className="flex gap-3 items-center">
                      {/* Category Selector */}
                      <div className="flex shrink-0 p-1 bg-gray-50 rounded-lg" data-tour="add-question-category">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => updateRow(row.id, 'category', cat.id)}
                            className={`relative w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs transition-all duration-200 ${row.category === cat.id
                              ? `${cat.color} text-white shadow-sm scale-110`
                              : 'text-gray-400 hover:text-gray-600'
                              }`}
                            title={cat.fullLabel}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Text Input with Clear Button */}
                      <div className="flex-1 flex items-center gap-2 relative w-full">
                        <textarea
                          value={row.content}
                          onChange={(e) => updateRow(row.id, 'content', e.target.value)}
                          placeholder={`Nhập ${row.category === 'truth' ? 'câu hỏi sự thật' : 'thử thách'}...`}
                          rows={1}
                          className={`centered-textarea flex-1 bg-transparent border-none outline-none text-gray-700 text-base font-medium placeholder-gray-400 resize-none pr-8 ${
                            row.errors.length > 0 ? 'text-red-600' : ''
                          }`}
                          maxLength={500}
                          data-tour="add-question-input"
                          onInput={(e) => {
                            const target = e.target;
                            target.style.height = 'auto';
                            const newHeight = Math.max(48, target.scrollHeight);
                            target.style.height = newHeight + 'px';
                            
                            // Switch between centered and multiline styles
                            if (newHeight > 48) {
                              target.className = target.className.replace('centered-textarea', 'multiline-textarea');
                            } else {
                              target.className = target.className.replace('multiline-textarea', 'centered-textarea');
                            }
                          }}
                        />
                        {/* Clear Button - only show when content exists */}
                        {row.content && (
                          <button
                            onClick={() => updateRow(row.id, 'content', '')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-95 z-10"
                            title="Xóa nội dung"
                          >
                            <span className="text-sm">✕</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className="w-8 h-8 flex shrink-0 items-center justify-center text-red-500 border border-red-500 bg-white rounded-full hover:bg-red-50 transition-colors shadow-sm active:scale-95"
                  >
                    <img src="/trash1.svg" alt="Delete" className="w-4 h-4" />
                  </button>
                </div>

                {/* Error messages - BELOW the main row */}
                {row.errors.length > 0 && (
                  <div className="ml-0 md:ml-12 mt-2">
                    <div className="text-red-500 space-y-1 text-xs">
                      {row.errors.map((error, errorIndex) => (
                        <div key={errorIndex} className="flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Row Button - inside scrollable area, below last row */}
            <button
              onClick={handleAddRow}
              className="w-full group relative"
              data-tour="add-question-add-row"
            >
              <div className="absolute inset-0 bg-gray-200 rounded-xl translate-y-1"></div>
              <div className="relative bg-white border-2 border-gray-200 py-2.5 rounded-xl font-bold text-gray-500 text-sm flex items-center justify-center gap-2 active:translate-y-1 transition-transform group-hover:border-purple-200 group-hover:text-purple-500">
                <span className="text-lg font-black">+</span> Thêm dòng
              </div>
            </button>
          </div>

          {/* Summary Counts */}
          <div className="flex justify-center gap-4 mb-4">
            {categories.map(cat => {
              const count = rows.filter(r => r.category === cat.id && r.content.trim()).length
              if (count === 0) return null
              return (
                <div key={cat.id} className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold text-white ${cat.color} shadow-sm animate-fade-in`}>
                  {cat.label}: {count}
                </div>
              )
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-white/30">
            <button
              onClick={handleSubmit}
              disabled={loading || !identityService.hasIdentity()}
              className="w-full group relative disabled:opacity-70 disabled:cursor-not-allowed"
              data-tour="add-question-submit"
            >
              <div className="absolute inset-0 bg-purple-700 rounded-xl translate-y-1"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg active:translate-y-1 transition-transform flex items-center justify-center gap-2">
                {loading ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <>
                    GỬI TẤT CẢ <span className="text-lg">🚀</span>
                  </>
                )}
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && globalError && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 max-w-md w-full shadow-2xl animate-pop-in relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowErrorModal(false)
                setGlobalError('')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold p-2"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="text-4xl mb-2">❌</div>
              <h2 className="text-xl font-black text-gray-800">Lỗi</h2>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-sm font-medium text-red-700 whitespace-pre-line text-left">{globalError}</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setShowErrorModal(false)
                  setGlobalError('')
                }}
                className="bg-red-500 border-2 border-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 max-w-md w-full shadow-2xl animate-pop-in relative">
            {/* Close Button */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold p-2"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="text-4xl mb-2">ℹ️</div>
              <h2 className="text-xl font-black text-gray-800">Hướng dẫn</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-xl flex gap-3 items-center">
                <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shrink-0 text-sm">T</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Sự thật (Truth)</h3>
                  <p className="text-xs text-gray-600">Trả lời câu hỏi một cách trung thực nhất.</p>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded-xl flex gap-3 items-center">
                <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold shrink-0 text-sm">D</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Thử thách (Dare)</h3>
                  <p className="text-xs text-gray-600">Thực hiện một hành động hoặc thử thách.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">� Quy tắc hviết câu hỏi:</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Tối đa 500 ký tự</li>
                <li>• Nội dung phải có ý nghĩa, không lặp lại ký tự</li>
                <li>• Truth: Khám phá suy nghĩ, cảm xúc</li>
                <li>• Dare: Vui nhộn, không nguy hiểm</li>
                <li>• Tránh nội dung nhạy cảm</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowInfo(false)}
                className="bg-gray-100 border-2 border-blue-500 text-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Đã hiểu!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Enhanced UI/UX */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none animate-confetti"></div>
          
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in relative overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 font-bold text-lg hover:scale-110 active:scale-95"
            >
              ✕
            </button>

            {/* Success Icon with Animation */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                {/* Icon Container */}
                <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-110">
                  <svg 
                    className="w-12 h-12 text-white animate-fade-in-scale" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                {/* Floating Particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-60" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -right-4 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Thành công!
              </h2>
              <p className="text-gray-500 text-sm">Câu hỏi của bạn đã được gửi</p>
            </div>

            {/* Success Message Card */}
            <div className="mb-6 relative">
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-200/50 shadow-inner relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/20 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <span className="text-xl">🎉</span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-800">Quá đã quá đã!</p>
                      <p className="text-xs text-gray-600 mt-0.5">Chuẩn bị tinh thần hôm đó thả gas nha!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="group relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <span className="relative flex items-center justify-center gap-2">
                  <span>Đã hiểu</span>
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Tour Guide */}
      <TourGuide
        tourName="add-question"
        steps={[
          {
            target: '[data-tour="add-question-category"]',
            content: 'Đây là nơi bạn thêm câu hỏi mới! Đầu tiên, chọn loại câu hỏi: T (Truth - Sự thật) hoặc D (Dare - Thử thách). Bạn cần ít nhất 10 câu mỗi loại để có thể gửi.',
            allowClickOutside: false
          },
          {
            target: '[data-tour="add-question-input"]',
            content: 'Nhập nội dung câu hỏi vào đây. Tối đa 500 ký tự. Bạn có thể nhấn nút X màu đỏ để xóa nội dung nếu cần.',
            allowClickOutside: false
          },
          {
            target: '[data-tour="add-question-add-row"]',
            content: 'Nhấn nút "Thêm dòng" để thêm câu hỏi mới. Bạn có thể thêm nhiều câu hỏi cùng lúc.',
            allowClickOutside: false
          },
          {
            target: '[data-tour="add-question-submit"]',
            content: 'Sau khi đã thêm đủ ít nhất 10 câu Truth và 10 câu Dare, nhấn nút "GỬI TẤT CẢ" để lưu các câu hỏi. Lưu ý: Bạn cần đăng nhập để thêm câu hỏi.',
            allowClickOutside: false
          }
        ]}
        onComplete={() => {}}
        autoStart={!tourService.isTourCompleted('add-question')}
      />
    </div>
  )
}

export default AddQuestionPage