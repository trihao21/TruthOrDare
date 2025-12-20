import { useState, useEffect } from 'react'
import WheelScreen from './components/WheelScreen'
import ResultScreen from './components/ResultScreen'
import CardScreen from './components/CardScreen'
import ManageScreen from './components/ManageScreen'
import QuestionInputScreen from './components/QuestionInputScreen'
import { api } from './services'

function App() {
  const [screen, setScreen] = useState('wheel')
  const [selectedResult, setSelectedResult] = useState(null)
  const [questions, setQuestions] = useState({
    'TRUTH': [],
    'DARE': [],
    'CỎ 3 LÁ': []
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const data = await api.getAllQuestions()
      const grouped = {
        'TRUTH': [],
        'DARE': [],
        'CỎ 3 LÁ': []
      }

      data.forEach(q => {
        if (grouped[q.category]) {
          grouped[q.category].push(q)
        }
      })

      setQuestions(grouped)
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  const handleSpinComplete = (result) => {
    setSelectedResult(result)
    setScreen('result')
    setTimeout(() => {
      setScreen('cards')
    }, 1000)
  }

  const handleManage = () => {
    setScreen('manage')
  }

  const handleBackToWheel = () => {
    setScreen('wheel')
    setSelectedResult(null)
  }

  const handleInput = () => {
    setScreen('input')
  }

  return (
    <>
      {screen === 'wheel' && (
        <WheelScreen
          onSpinComplete={handleSpinComplete}
          onManage={handleManage}
          onInput={handleInput}
        />
      )}

      {screen === 'result' && selectedResult && (
        <ResultScreen result={selectedResult} />
      )}

      {screen === 'cards' && selectedResult && (
        <CardScreen
          result={selectedResult}
          questions={questions[selectedResult.label]}
          onBack={handleBackToWheel}
        />
      )}

      {screen === 'manage' && (
        <ManageScreen
          questions={questions}
          onBack={handleBackToWheel}
          onUpdate={loadQuestions}
        />
      )}

      {screen === 'input' && (
        <QuestionInputScreen
          onBack={handleBackToWheel}
        />
      )}
    </>
  )
}

export default App
