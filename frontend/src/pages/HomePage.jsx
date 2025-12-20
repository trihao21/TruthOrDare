import { useState } from 'react'
import WheelScreen from '../components/WheelScreen'
import ResultScreen from '../components/ResultScreen'
import CardScreen from '../components/CardScreen'

function HomePage({ questions, onQuestionsUpdate }) {
  const [screen, setScreen] = useState('wheel')
  const [selectedResult, setSelectedResult] = useState(null)

  const handleSpinComplete = (result) => {
    setSelectedResult(result)
    setScreen('result')
    setTimeout(() => {
      setScreen('cards')
    }, 1000)
  }

  const handleBackToWheel = () => {
    setScreen('wheel')
    setSelectedResult(null)
  }

  return (
    <>
      {screen === 'wheel' && (
        <WheelScreen
          onSpinComplete={handleSpinComplete}
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
    </>
  )
}

export default HomePage