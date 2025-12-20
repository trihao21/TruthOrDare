import { useNavigate } from 'react-router-dom'
import ManageScreen from '../components/ManageScreen'

function ManagePage({ questions, onQuestionsUpdate }) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <ManageScreen
      questions={questions}
      onBack={handleBack}
      onUpdate={onQuestionsUpdate}
    />
  )
}

export default ManagePage