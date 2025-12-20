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
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Initialize auth
      await authService.init()
      
      // Load questions
      await loadQuestions()
    } catch (error) {
      console.error('App initialization failed:', error)
      setError(error.message)
    }
  }

  const loadQuestions = async () => {
    try {
      console.log('Loading questions...')
      setLoading(true)
      setError(null)
      
      const response = await api.getAllQuestions()
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
      setError(error.message)
      // Set empty arrays to prevent crashes
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
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: 'red',
        flexDirection: 'column'
      }}>
        <div>Lỗi: {error}</div>
        <button onClick={loadQuestions} style={{ marginTop: '10px' }}>
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <Router>
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
