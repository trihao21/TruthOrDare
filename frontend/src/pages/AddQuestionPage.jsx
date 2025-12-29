import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { questionService, authService } from '../services'
import { api } from '../services/api.js'
import { identityService } from '../services/identityService'
import TourGuide from '../components/TourGuide'
import { tourService } from '../services/tourService'

// Helper for generating unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

function AddQuestionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const scrollContainerRef = useRef(null)
  
  const isActive = (path) => location.pathname === path
  
  const [rows, setRows] = useState([
    { id: generateId(), content: '', category: 'truth', isNew: false, errors: [] }
  ])
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userQuestionCounts, setUserQuestionCounts] = useState({ truth: 0, dare: 0 })

  const categories = [
    { id: 'truth', label: 'T', color: 'bg-blue-500', fullLabel: 'Sự thật' },
    { id: 'dare', label: 'D', color: 'bg-red-500', fullLabel: 'Thử thách' }
  ]

  const MAX_QUESTIONS_PER_CATEGORY = 10

  // Load user question counts on mount
  useEffect(() => {
    const loadUserQuestionCounts = async () => {
      try {
        const identity = identityService.getAssignedIdentity()
        if (!identity) return

        const username = identityService.getUsernameFromIdentity(identity)
        if (!username) return

        // Auto-login to get user info
        const currentUser = authService.getCurrentUser()
        if (!authService.isAuthenticated() || !currentUser || currentUser.username !== username) {
          // Get password from account info
          const accountInfo = identityService.getAccountInfo()
          const password = accountInfo?.password || '123456' // Fallback to default if accountInfo not available
          await authService.login(username, password)
        }

        const updatedUser = authService.getCurrentUser()
        const userId = updatedUser?.id || updatedUser?._id
        if (userId) {
          // Use getAllQuestions which now returns only user's questions
          const userQuestions = await questionService.getAllQuestions(false)
          // userQuestions is now always an array (empty if API fails)
          const truthCount = (userQuestions || []).filter(q => (q.type || q.category) === 'truth').length
          const dareCount = (userQuestions || []).filter(q => (q.type || q.category) === 'dare').length
          setUserQuestionCounts({ truth: truthCount, dare: dareCount })
        }
      } catch (error) {
        console.error('Error loading user question counts:', error)
        // Set to 0 if error - backend will still validate
        setUserQuestionCounts({ truth: 0, dare: 0 })
      }
    }

    loadUserQuestionCounts()
  }, [])

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
    const identity = identityService.getAssignedIdentity()
    if (!identity) {
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

    // Check for empty rows and collect error details
    const validRows = rows.filter(r => r.content.trim())
    const emptyRows = rows.filter(r => !r.content.trim())
    const rowsWithErrors = validatedRows.filter(r => r.errors.length > 0)

    // if (hasErrors || emptyRows.length > 0) {
    //   let errorMessage = 'Vui lòng sửa các lỗi sau trước khi gửi:\n'
     
    //   // List specific validation errors
    //   if (rowsWithErrors.length > 0) {
    //     const errorTypes = new Set()
    //     rowsWithErrors.forEach(row => {
    //       row.errors.forEach(err => {
    //         if (err.includes('vượt quá')) {
    //           errorTypes.add('Câu hỏi quá dài (tối đa 500 ký tự)')
    //         } else if (err.includes('lặp lại ký tự')) {
    //           errorTypes.add('Câu hỏi cần có nội dung có ý nghĩa')
    //         } else if (err.includes('để trống')) {
    //           // Already handled above
    //         }
    //       })
    //     })
        
    //     if (errorTypes.size > 0) {
    //       errorTypes.forEach(errType => {
    //         errorMessage += `• ${errType}\n`
    //       })
    //     }
    //   }
      
    //   // Show current valid count
    //   const truthCount = validRows.filter(r => r.category === 'truth').length
    //   const dareCount = validRows.filter(r => r.category === 'dare').length
    //   errorMessage += `\nHiện tại bạn có ${validRows.length} ${validRows.length === 1 ? 'câu hỏi hợp lệ' : 'câu hỏi hợp lệ'} (Truth: ${truthCount}, Dare: ${dareCount})`
    //   errorMessage += `\nCần ít nhất 10 câu Truth và 10 câu Dare để có thể gửi.`
      
    //   setGlobalError(errorMessage)
    //   setShowErrorModal(true)
    //   return
    // }

    // Count new questions to be added in current submission
    const newTruthCount = validRows.filter(r => r.category === 'truth').length
    const newDareCount = validRows.filter(r => r.category === 'dare').length

    // Check limit FIRST (before minimum requirements) - user cannot add more than 10 questions per category
    let existingTruthCount = 0
    let existingDareCount = 0
    
    try {
      // Auto-login to get user info for limit check
      const username = identityService.getUsernameFromIdentity(identity)
      if (username) {
        const currentUser = authService.getCurrentUser()
        if (!authService.isAuthenticated() || !currentUser || currentUser.username !== username) {
          // Get password from account info
          const accountInfo = identityService.getAccountInfo()
          const password = accountInfo?.password || '123456' // Fallback to default if accountInfo not available
          const loginResult = await authService.login(username, password)
          if (!loginResult.success) {
            // If login fails, show error and return - don't continue with wrong credentials
            setGlobalError('Không thể đăng nhập. Vui lòng bốc thăm lại để nhận tài khoản mới.')
            setShowErrorModal(true)
            return
          }
        }
        
        const updatedUser = authService.getCurrentUser()
        const userId = updatedUser?.id || updatedUser?._id
        if (userId) {
          // Get current question counts (already existing in database)
          // Use getAllQuestions which now returns only user's questions
          const userQuestions = await questionService.getAllQuestions(false)
          // userQuestions is now always an array (empty if API fails)
          existingTruthCount = (userQuestions || []).filter(q => (q.type || q.category) === 'truth').length
          existingDareCount = (userQuestions || []).filter(q => (q.type || q.category) === 'dare').length
          
          const MAX_PER_CATEGORY = 10
          
          // Check limits - user cannot add more than 10 questions per category
          if (existingTruthCount + newTruthCount > MAX_PER_CATEGORY) {
            const total = existingTruthCount + newTruthCount
            const exceeded = total - MAX_PER_CATEGORY
            // Format error message similar to minimum requirements
            let errorMessage = `Truth:\nĐã điền: ${total}/${MAX_PER_CATEGORY}\nVượt quá: ${exceeded}`
            
            // Also show Dare status if available
            const totalDare = existingDareCount + newDareCount
            if (totalDare >= MAX_PER_CATEGORY) {
              errorMessage += `\n\nDare: ${totalDare}/${MAX_PER_CATEGORY} ✓`
            } else {
              const missingDare = MAX_PER_CATEGORY - totalDare
              errorMessage += `\n\nDare:\nĐã điền: ${totalDare}/${MAX_PER_CATEGORY}\nCòn thiếu: ${missingDare}`
            }
            
            setGlobalError(errorMessage)
            setShowErrorModal(true)
            return
          }
          
          if (existingDareCount + newDareCount > MAX_PER_CATEGORY) {
            const total = existingDareCount + newDareCount
            const exceeded = total - MAX_PER_CATEGORY
            // Format error message similar to minimum requirements
            let errorMessage = ''
            
            // Show Truth status first
            const totalTruth = existingTruthCount + newTruthCount
            if (totalTruth >= MAX_PER_CATEGORY) {
              errorMessage = `Truth: ${totalTruth}/${MAX_PER_CATEGORY} ✓`
            } else {
              const missingTruth = MAX_PER_CATEGORY - totalTruth
              errorMessage = `Truth:\nĐã điền: ${totalTruth}/${MAX_PER_CATEGORY}\nCòn thiếu: ${missingTruth}`
            }
            
            // Then show Dare with exceeded
            errorMessage += `\n\nDare:\nĐã điền: ${total}/${MAX_PER_CATEGORY}\nVượt quá: ${exceeded}`
            
            setGlobalError(errorMessage)
            setShowErrorModal(true)
            return
          }
        }
      }
    } catch (error) {
      console.error('Error checking limits:', error)
      // If error is about authentication, show proper error
      const errorMessage = error.message || error.toString()
      if (errorMessage.includes('Phiên đăng nhập') || errorMessage.includes('credentials') || errorMessage.includes('Invalid')) {
        setGlobalError('Không thể đăng nhập. Vui lòng bốc thăm lại để nhận tài khoản mới.')
        setShowErrorModal(true)
        return
      }
      // For other errors, continue anyway - backend will validate
    }

    // Check minimum requirements: total (existing + new) must have at least 10 truth and 10 dare
    // If user already has 10 Truth + 10 Dare, skip minimum check
    const MIN_REQUIRED = 10
    const totalTruthCount = existingTruthCount + newTruthCount
    const totalDareCount = existingDareCount + newDareCount
    
    // Only check minimum if user hasn't met the requirement yet
    if (totalTruthCount < MIN_REQUIRED || totalDareCount < MIN_REQUIRED) {
      // Store error data in a structured format for better UI display
      const errorData = {
        truth: {
          current: totalTruthCount,
          required: MIN_REQUIRED,
          missing: totalTruthCount < MIN_REQUIRED ? MIN_REQUIRED - totalTruthCount : 0,
          isComplete: totalTruthCount >= MIN_REQUIRED
        },
        dare: {
          current: totalDareCount,
          required: MIN_REQUIRED,
          missing: totalDareCount < MIN_REQUIRED ? MIN_REQUIRED - totalDareCount : 0,
          isComplete: totalDareCount >= MIN_REQUIRED
        }
      }
      
      // Create a simple text message for backward compatibility
      let errorMessage = ''
      if (!errorData.truth.isComplete) {
        errorMessage += `Truth:\nĐã điền: ${errorData.truth.current}/${errorData.truth.required}\nCòn thiếu: ${errorData.truth.missing}`
      } else {
        errorMessage += `Truth: ${errorData.truth.current}/${errorData.truth.required} ✓`
      }
      
      if (!errorData.dare.isComplete) {
        if (errorMessage) errorMessage += '\n\n'
        errorMessage += `Dare:\nĐã điền: ${errorData.dare.current}/${errorData.dare.required}\nCòn thiếu: ${errorData.dare.missing}`
      } else {
        if (errorMessage) errorMessage += '\n\n'
        errorMessage += `Dare: ${errorData.dare.current}/${errorData.dare.required} ✓`
      }
      
      // Store structured data in a way we can access it in the modal
      setGlobalError(errorMessage)
      // Store error data in a ref or state for modal to use
      setShowErrorModal(true)
      return
    }

    // Show confirmation modal
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    // Close confirmation modal
    setShowConfirmModal(false)

    // Check identity again
    const identity = identityService.getAssignedIdentity()
    if (!identity) {
      setGlobalError('Bạn cần bốc thăm identity trước khi thêm câu hỏi')
      setShowErrorModal(true)
      return
    }

    // Auto-login with identity's account before submitting
    try {
      const username = identityService.getUsernameFromIdentity(identity)
      if (!username) {
        setGlobalError('Không thể xác định tài khoản từ identity. Vui lòng thử lại.')
        setShowErrorModal(true)
        return
      }
      
      // Get password from account info (stored when user drew identity)
      const accountInfo = identityService.getAccountInfo()
      const password = accountInfo?.password || '123456' // Fallback to default if accountInfo not available
      
      // Check if already authenticated with the correct user
      const currentUser = authService.getCurrentUser()
      if (!authService.isAuthenticated() || !currentUser || currentUser.username !== username) {
        // Clear manual logout flag when auto-login for submitting questions
        identityService.clearManualLogout()
        const loginResult = await authService.login(username, password)
        if (!loginResult.success) {
          // If login fails, show error and return
          setGlobalError('Không thể đăng nhập. Vui lòng bốc thăm lại để nhận tài khoản mới.')
          setShowErrorModal(true)
          return
        }
        // Verify authentication after login
        if (!authService.isAuthenticated()) {
          setGlobalError('Đăng nhập thành công nhưng không thể xác thực. Vui lòng thử lại.')
          setShowErrorModal(true)
          return
        }
      }
    } catch (error) {
      console.error('Auto-login failed:', error)
      // Check if error is about authentication
      const errorMessage = error.message || error.toString()
      if (errorMessage.includes('credentials') || errorMessage.includes('Invalid') || errorMessage.includes('Hết phiên')) {
        setGlobalError('Không thể đăng nhập. Vui lòng bốc thăm lại để nhận tài khoản mới.')
      } else {
        setGlobalError(`Không thể đăng nhập với tài khoản ${identity.displayName}. Vui lòng thử lại.`)
      }
      setShowErrorModal(true)
      return
    }

    // Filter valid rows (non-empty content) from current rows state
    // Note: Minimum requirements (10 truth + 10 dare) already checked in handleSubmit
    const validRows = rows.filter(r => r.content.trim())

    if (validRows.length === 0) {
      setGlobalError('Vui lòng nhập ít nhất một câu hỏi')
      setShowErrorModal(true)
      return
    }

    // Verify authentication before submitting
    if (!authService.isAuthenticated()) {
      setGlobalError('Phiên đăng nhập đã hết hạn. Vui lòng thử lại.')
      setShowErrorModal(true)
      return
    }
    
    // Verify token exists
    const token = api.getToken()
    if (!token) {
      setGlobalError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.')
      setShowErrorModal(true)
      return
    }

    setLoading(true)
    setGlobalError('')
    
    try {
      // Submit all valid rows in parallel - Call API to send questions
      const results = await Promise.all(
        validRows.map(row => questionService.addQuestion(row.category, row.content.trim()))
      )

      // Check results and collect detailed errors
      const failedSubmissions = results.filter(result => !result.success)
      
      if (failedSubmissions.length > 0) {
        const errorMessages = failedSubmissions.map(result => result.error).join(', ')
        // Check if error is about limit
        if (errorMessages.includes('giới hạn') || errorMessages.includes('tối đa')) {
          setGlobalError(errorMessages)
        } else {
          setGlobalError(`Không thể thêm một số câu hỏi: ${errorMessages}`)
        }
        setShowErrorModal(true)
        // Reload counts after error
        try {
          const updatedUser = authService.getCurrentUser()
          const userId = updatedUser?.id || updatedUser?._id
          if (userId) {
            // Use getAllQuestions which now returns only user's questions
          const userQuestions = await questionService.getAllQuestions(false)
            // userQuestions is now always an array (empty if API fails)
            const truthCount = (userQuestions || []).filter(q => (q.type || q.category) === 'truth').length
            const dareCount = (userQuestions || []).filter(q => (q.type || q.category) === 'dare').length
            setUserQuestionCounts({ truth: truthCount, dare: dareCount })
          }
        } catch (countError) {
          console.error('Error reloading counts:', countError)
        }
        return
      }
      
      // Reload counts after successful submission
      try {
        const updatedUser = authService.getCurrentUser()
        const userId = updatedUser?.id || updatedUser?._id
        if (userId) {
          // Use getAllQuestions which now returns only user's questions
          const userQuestions = await questionService.getAllQuestions(false)
          // userQuestions is now always an array (empty if API fails)
          const truthCount = (userQuestions || []).filter(q => (q.type || q.category) === 'truth').length
          const dareCount = (userQuestions || []).filter(q => (q.type || q.category) === 'dare').length
          setUserQuestionCounts({ truth: truthCount, dare: dareCount })
        }
      } catch (countError) {
        console.error('Error reloading counts:', countError)
      }

      // Show success message
      setShowSuccessModal(true)
      // Reset to one empty row
      setRows([{ id: generateId(), content: '', category: 'truth', isNew: false, errors: [] }])
    } catch (error) {
      console.error('Submit error:', error)
      // Check if error is about limit
      const errorMessage = error.message || 'Gửi câu hỏi thất bại. Vui lòng thử lại.'
      if (errorMessage.includes('giới hạn') || errorMessage.includes('tối đa')) {
        setGlobalError(errorMessage)
      } else {
        setGlobalError(errorMessage)
      }
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const identity = identityService.getAssignedIdentity()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] flex flex-col font-sans">
      {/* Navbar - Same as Layout */}
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
              onClick={() => setShowInfo(true)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-3">
               {/* Show add question link if user has identity */}
               {identity && (
                <>
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
                  <Link 
                    to="/summary" 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/summary') 
                        ? 'text-purple-600 bg-purple-50 font-semibold' 
                        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Câu hỏi của tôi
                  </Link>
                </>
              )}
              {/* Timeline button */}
              <Link 
                to="/timeline" 
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Timeline
              </Link>
              
              {identity ? (
                <>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-2xl">{identity.avatar}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {identity.displayName}
                    </span>
                  </div>
                  
                  <button
                    onClick={async () => {
                      await authService.logout()
                      identityService.setManualLogout()
                      navigate('/')
                    }}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Bốc thăm
                </Link>
              )}

              {/* Info Button */}
             
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col items-center relative overflow-auto">
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
            {(() => {
              const totalTruth = (userQuestionCounts.truth || 0) + rows.filter(r => r.category === 'truth' && r.content.trim()).length
              const totalDare = (userQuestionCounts.dare || 0) + rows.filter(r => r.category === 'dare' && r.content.trim()).length
              const isAtMaxLimit = totalTruth >= MAX_QUESTIONS_PER_CATEGORY && totalDare >= MAX_QUESTIONS_PER_CATEGORY
              
              return (
                <button
                  onClick={handleAddRow}
                  disabled={isAtMaxLimit}
                  className={`w-full group relative ${isAtMaxLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  data-tour="add-question-add-row"
                  title={isAtMaxLimit ? 'Bạn đã đạt giới hạn tối đa 10 câu Truth và 10 câu Dare' : ''}
                >
                  <div className="absolute inset-0 bg-gray-200 rounded-xl translate-y-1"></div>
                  <div className={`relative bg-white border-2 border-gray-200 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform ${
                    isAtMaxLimit 
                      ? 'text-gray-400' 
                      : 'text-gray-500 active:translate-y-1 group-hover:border-purple-200 group-hover:text-purple-500'
                  }`}>
                    <span className="text-lg font-black">+</span> Thêm dòng
                    {isAtMaxLimit && <span className="ml-2 text-xs">(Đã đạt giới hạn)</span>}
                  </div>
                </button>
              )
            })()}
          </div>

          {/* Summary Counts */}
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            {categories.map(cat => {
              const count = rows.filter(r => r.category === cat.id && r.content.trim()).length
              const currentCount = userQuestionCounts[cat.id] || 0
              const totalAfterAdd = currentCount + count
              const isAtLimit = currentCount >= MAX_QUESTIONS_PER_CATEGORY
              const willExceedLimit = totalAfterAdd > MAX_QUESTIONS_PER_CATEGORY
              
              // Always show badge for both Truth and Dare
              return (
                <div 
                  key={cat.id} 
                  className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold text-white ${cat.color} shadow-sm animate-fade-in ${
                    willExceedLimit ? 'ring-2 ring-red-500' : isAtLimit ? 'ring-2 ring-yellow-500' : ''
                  }`}
                  title={
                    isAtLimit 
                      ? `Đã đạt giới hạn ${MAX_QUESTIONS_PER_CATEGORY} câu ${cat.fullLabel}` 
                      : willExceedLimit
                      ? `Sẽ vượt quá giới hạn ${MAX_QUESTIONS_PER_CATEGORY} câu ${cat.fullLabel}`
                      : `${totalAfterAdd}/${MAX_QUESTIONS_PER_CATEGORY} câu ${cat.fullLabel} (đã có: ${currentCount}, thêm mới: ${count})`
                  }
                >
                  {cat.label}: {totalAfterAdd}/{MAX_QUESTIONS_PER_CATEGORY}
                  {isAtLimit && <span className="ml-1">⚠️</span>}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-pop-in relative">
            {/* Close Button */}
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 font-bold text-lg hover:scale-110 active:scale-95"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-12 h-12 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Xác nhận gửi câu hỏi
              </h2>
              <p className="text-gray-600 text-sm">Bạn có chắc chắn muốn gửi các câu hỏi này không?</p>
            </div>

            {/* Question Count */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 rounded-2xl border-2 border-purple-200/50">
                <div className="space-y-2">
                  {categories.map(cat => {
                    const count = rows.filter(r => r.category === cat.id && r.content.trim()).length
                    if (count === 0) return null
                    return (
                      <div key={cat.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{cat.fullLabel}:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${cat.color} shadow-sm`}>
                          {count} câu
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Tổng cộng:</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm">
                      {rows.filter(r => r.content.trim()).length} câu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

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

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">Lỗi</h2>
              <p className="text-sm text-gray-500">Vui lòng kiểm tra lại thông tin</p>
            </div>

            {/* Content - Parse and display structured error info */}
            <div className="mb-6">
              {(() => {
                // Parse error message to extract Truth and Dare info
                const lines = globalError.split('\n')
                const truthSection = []
                const dareSection = []
                let currentSection = null
                
                lines.forEach(line => {
                  if (line.startsWith('Truth:')) {
                    currentSection = 'truth'
                    truthSection.push(line)
                  } else if (line.startsWith('Dare:')) {
                    currentSection = 'dare'
                    dareSection.push(line)
                  } else if (currentSection === 'truth' && line.trim()) {
                    truthSection.push(line)
                  } else if (currentSection === 'dare' && line.trim()) {
                    dareSection.push(line)
                  }
                })
                
                const parseSection = (section) => {
                  if (section.length === 0) return null
                  const firstLine = section[0]
                  if (firstLine.includes('✓')) {
                    // Complete
                    const match = firstLine.match(/(\d+)\/(\d+)/)
                    return { 
                      type: firstLine.toLowerCase().includes('truth') ? 'truth' : 'dare',
                      current: match ? parseInt(match[1]) : 0, 
                      required: match ? parseInt(match[2]) : 10, 
                      missing: 0,
                      exceeded: 0,
                      isComplete: true,
                      isExceeded: false
                    }
                  } else {
                    // Incomplete or Exceeded
                    const currentMatch = section[1]?.match(/Đã điền: (\d+)\/(\d+)/)
                    const missingMatch = section[2]?.match(/Còn thiếu: (\d+)/)
                    const exceededMatch = section[2]?.match(/Vượt quá: (\d+)/)
                    
                    return {
                      type: firstLine.toLowerCase().includes('truth') ? 'truth' : 'dare',
                      current: currentMatch ? parseInt(currentMatch[1]) : 0,
                      required: currentMatch ? parseInt(currentMatch[2]) : 10,
                      missing: missingMatch ? parseInt(missingMatch[1]) : 0,
                      exceeded: exceededMatch ? parseInt(exceededMatch[1]) : 0,
                      isComplete: false,
                      isExceeded: !!exceededMatch
                    }
                  }
                }
                
                const truthData = parseSection(truthSection)
                const dareData = parseSection(dareSection)
                
                // If parsing fails, show original message
                if (!truthData && !dareData) {
                  return (
                    <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                      <p className="text-sm font-medium text-red-700 whitespace-pre-line text-left">{globalError}</p>
                    </div>
                  )
                }
                
                return (
                  <div className="space-y-3">
                    {/* Truth Card */}
                    {truthData && (
                      <div className={`p-4 rounded-xl border-2 ${
                        truthData.isComplete 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm">T</span>
                            <span className="font-bold text-gray-800">Truth</span>
                          </div>
                          {truthData.isComplete && (
                            <span className="text-green-600 font-bold text-lg">✓</span>
                          )}
                        </div>
                        {!truthData.isComplete && (
                          <div className="space-y-1.5 mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Đã điền:</span>
                              <span className="font-bold text-gray-800">{truthData.current}/{truthData.required}</span>
                            </div>
                            {truthData.isExceeded ? (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-red-600 font-medium">Vượt quá:</span>
                                <span className="font-bold text-red-600">{truthData.exceeded}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-red-600 font-medium">Còn thiếu:</span>
                                <span className="font-bold text-red-600">{truthData.missing}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {truthData.isComplete && (
                          <div className="text-sm text-green-700 font-medium mt-2">
                            Đã đủ {truthData.current}/{truthData.required} câu
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Dare Card */}
                    {dareData && (
                      <div className={`p-4 rounded-xl border-2 ${
                        dareData.isComplete 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-sm">D</span>
                            <span className="font-bold text-gray-800">Dare</span>
                          </div>
                          {dareData.isComplete && (
                            <span className="text-green-600 font-bold text-lg">✓</span>
                          )}
                        </div>
                        {!dareData.isComplete && (
                          <div className="space-y-1.5 mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Đã điền:</span>
                              <span className="font-bold text-gray-800">{dareData.current}/{dareData.required}</span>
                            </div>
                            {dareData.isExceeded ? (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-red-600 font-medium">Vượt quá:</span>
                                <span className="font-bold text-red-600">{dareData.exceeded}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-red-600 font-medium">Còn thiếu:</span>
                                <span className="font-bold text-red-600">{dareData.missing}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {dareData.isComplete && (
                          <div className="text-sm text-green-700 font-medium mt-2">
                            Đã đủ {dareData.current}/{dareData.required} câu
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setShowErrorModal(false)
                  setGlobalError('')
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
      </div>

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
            content: 'Sau khi đã thêm đủ tối đa 10 câu Truth và 10 câu Dare, nhấn nút "GỬI TẤT CẢ" để lưu các câu hỏi.',
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