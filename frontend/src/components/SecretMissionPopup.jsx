import { useNavigate } from 'react-router-dom'

function SecretMissionPopup({ onClose }) {
  const navigate = useNavigate()

  const handleContinue = () => {
    onClose()
    navigate('/mission-login', { state: { redirectTo: '/mission' } })
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-pop-in relative overflow-hidden border-2 border-[#D4CEFF]">
        {/* Decorative gradient elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4CEFF]/30 to-[#A1CDED]/30 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#A1CDED]/30 to-[#D4CEFF]/30 rounded-full -ml-12 -mb-12"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="text-7xl mb-6 animate-bounce">🎯</div>
          
          {/* Title */}
          <h2 className="text-3xl font-black bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] bg-clip-text text-transparent mb-4">
            Nhiệm Vụ Bí Mật
          </h2>
          
          {/* Description */}
          <div className="bg-gradient-to-br from-[#D4CEFF]/10 to-[#A1CDED]/10 rounded-2xl p-6 mb-6 border border-[#D4CEFF]/30">
            <p className="text-gray-800 text-base leading-relaxed mb-4 font-medium">
              Chúc mừng bạn đã hoàn thành việc thêm câu hỏi! 🎉
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Bạn đã mở khóa tính năng <span className="font-bold text-[#D4CEFF]">Nhiệm Vụ Bí Mật</span>! 
              Hệ thống sẽ gửi nhiệm vụ đặc biệt cho bạn sau mỗi khoảng thời gian cố định.
            </p>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-[#A1CDED]/10 to-[#D4CEFF]/10 rounded-xl p-4 mb-6 text-left border border-[#A1CDED]/30">
            <p className="text-gray-800 text-sm font-semibold mb-2">✨ Tính năng:</p>
            <ul className="text-gray-700 text-xs space-y-1 ml-4">
              <li>• Nhiệm vụ được gửi định kỳ</li>
              <li>• Phần thưởng độc quyền</li>
              <li>• Trải nghiệm độc đáo</li>
            </ul>
          </div>

          {/* Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white font-bold py-4 px-6 rounded-xl hover:from-[#D4CEFF]/90 hover:to-[#A1CDED]/90 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-lg"
          >
            Tiếp Theo →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecretMissionPopup

