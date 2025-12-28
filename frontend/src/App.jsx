import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RoleBasedRedirect from './components/RoleBasedRedirect'
import HomePage from './pages/HomePage'
import AddQuestionPage from './pages/AddQuestionPage'
import ManagePage from './pages/ManagePage'
import LoginPage from './pages/LoginPage'
import MissionLoginPage from './pages/MissionLoginPage'
import MissionPage from './pages/MissionPage'
import TimelinePage from './pages/TimelinePage'
import SummaryPage from './pages/SummaryPage'
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
    
    // Set a maximum loading time to prevent infinite loading (increased for Render wake-up)
    const maxLoadingTimer = setTimeout(() => {
      if (isMounted) {
        console.warn('Loading timeout - rendering app anyway')
        setLoading(false)
        setError('Server lỏ nên hay bị lỗi. Mọi người bấm nút Thử lại bên dưới để reload nha!')
        setQuestions({
          'TRUTH': [],
          'DARE': [],
          'CỎ 3 LÁ': []
        })
      }
    }, 35000) // 35 seconds max loading time (allows time for Render to wake up)
    
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
      
      // Add timeout to prevent hanging (increased to 30 seconds for Render free tier wake-up)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - không thể kết nối đến server. Server có thể đang wake up (Render free tier). Vui lòng thử lại sau vài giây.')), 30000)
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
          bottom: '20px',
          right: '20px',
          maxWidth: '400px',
          backgroundColor: '#fee2e2',
          border: '2px solid #dc2626',
          borderRadius: '8px',
          padding: '12px 16px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ color: '#dc2626', fontSize: '14px', lineHeight: '1.4' }}>
            ⚠️ {error}
          </div>
          <button
            onClick={() => {
              setError(null)
              loadQuestions()
            }}
            style={{
              alignSelf: 'flex-end',
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
        <Route path="/mission-login" element={<MissionLoginPage />} />
        <Route path="/mission" element={<MissionPage />} />
        
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
              <Route path="/summary" element={<SummaryPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
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
