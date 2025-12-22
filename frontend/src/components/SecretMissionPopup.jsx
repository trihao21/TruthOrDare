import { useNavigate } from 'react-router-dom'

function SecretMissionPopup({ onClose }) {
  const navigate = useNavigate()

  const handleNext = () => {
    onClose()
    navigate('/mission-login')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute w-10 h-10 flex items-center justify-center rounded-full top-4 right-4 text-gray-400 hover:text-purple-600 text-xl font-semibold hover:bg-purple-50 transition-all duration-200 hover:scale-110"
          aria-label="Đóng"
        >
          ✕
        </button>
        
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nhiệm Vụ Bí Mật</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Chúc mừng bạn đã hoàn thành việc thêm câu hỏi! Bây giờ bạn có cơ hội tham gia vào một nhiệm vụ bí mật đặc biệt. Hãy đăng nhập để khám phá!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Bỏ qua
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretMissionPopup
