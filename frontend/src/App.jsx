import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RoleBasedRedirect from './components/RoleBasedRedirect'
import HomePage from './pages/HomePage'
import AddQuestionPage from './pages/AddQuestionPage'
import ManagePage from './pages/ManagePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import { api, authService } from './services'

function App() {
  const [questions, setQuestions] = useState({
    'TRUTH': [],
    'DARE': [],
    'CỎ 3 LÁ': []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log('App rendered, loading:', loading, 'error:', error)

  useEffect(() => {
    console.log('App useEffect triggered')
    let isMounted = true
    
    // Set a maximum loading time to prevent infinite loading
    const maxLoadingTimer = setTimeout(() => {
      if (isMounted) {
        console.warn('Loading timeout - rendering app anyway')
        setLoading(false)
        setError('Không thể tải dữ liệu từ server. Ứng dụng sẽ hoạt động với dữ liệu mặc định.')
        setQuestions({
          'TRUTH': [],
          'DARE': [],
          'CỎ 3 LÁ': []
        })
      }
    }, 8000) // 8 seconds max loading time
    
    initializeApp()
    
    return () => {
      isMounted = false
      clearTimeout(maxLoadingTimer)
    }
  }, [])

  const initializeApp = async () => {
    try {
      // Initialize auth (non-blocking)
      authService.init().catch(() => {
        // Auth init failed, continue anyway
      })
      
      // Load questions with fallback
      await loadQuestions()
    } catch (error) {
      console.error('App initialization failed:', error)
      // Don't block the app, just show error and continue
      setError(error.message)
      setLoading(false)
      // Set empty questions to allow app to render
      setQuestions({
        'TRUTH': [],
        'DARE': [],
        'CỎ 3 LÁ': []
      })
    }
  }

  const loadQuestions = async () => {
    try {
      console.log('Loading questions...')
      setLoading(true)
      setError(null)
      
      // Add timeout to prevent hanging (increased to 10 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.')), 10000)
      )
      
      const response = await Promise.race([
        api.getAllQuestions(),
        timeoutPromise
      ])
      console.log('API response:', response)
      
      // Handle both array and object responses
      const data = response.questions || response
      console.log('Processed data:', data)
      
      const grouped = {
        'TRUTH': [],
        'DARE': [],
        'CỎ 3 LÁ': []
      }

      // Map backend categories to frontend display names
      const categoryMap = {
        'truth': 'TRUTH',
        'dare': 'DARE',
        'lucky': 'CỎ 3 LÁ'
      }

      if (Array.isArray(data)) {
        data.forEach(q => {
          const displayCategory = categoryMap[q.category?.toLowerCase()] || q.category?.toUpperCase()
          if (grouped[displayCategory]) {
            grouped[displayCategory].push({
              ...q,
              category: displayCategory // Ensure category field exists
            })
          }
        })
      }

      console.log('Grouped questions:', grouped)
      setQuestions(grouped)
    } catch (error) {
      console.error('Failed to load questions:', error)
      // Don't show error if it's just a timeout - app can still work
      const errorMessage = error.message || 'Không thể tải dữ liệu từ server'
      if (!errorMessage.includes('timeout')) {
        setError(errorMessage)
      }
      // Set empty arrays to prevent crashes - app can still work without questions
      setQuestions({
        'TRUTH': [],
        'DARE': [],
        'CỎ 3 LÁ': []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Đang tải...
      </div>
    )
  }

  // Always render the app, even if there's an error
  // Error will be shown as a banner, not blocking the UI

  return (
    <Router>
      {/* Show error banner if there's an error */}
      {error && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fee2e2',
          borderBottom: '2px solid #dc2626',
          padding: '12px 20px',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ color: '#dc2626', fontSize: '14px', flex: 1 }}>
            ⚠️ {error}
          </div>
          <button
            onClick={() => {
              setError(null)
              loadQuestions()
            }}
            style={{
              marginLeft: '20px',
              padding: '6px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Thử lại
          </button>
        </div>
      )}
      
      <Routes>
        {/* Routes without Layout (full-screen pages) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Routes with Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route 
                path="/" 
                element={
                  <RoleBasedRedirect>
                    <HomePage 
                      questions={questions} 
                      onQuestionsUpdate={loadQuestions} 
                    />
                  </RoleBasedRedirect>
                } 
              />
              <Route path="/add-question" element={<AddQuestionPage />} />
              <Route 
                path="/manage" 
                element={
                  <RoleBasedRedirect>
                    <ManagePage 
                      questions={questions} 
                      onQuestionsUpdate={loadQuestions} 
                    />
                  </RoleBasedRedirect>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
