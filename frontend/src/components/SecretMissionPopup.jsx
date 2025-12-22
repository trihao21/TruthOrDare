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
          
          {/* Title - Enhanced visibility */}
          <div className="mb-6">
            <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-[#6B5FCF] via-[#8B7FD9] to-[#4A90E2] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(107,95,207,0.3)]">
              Nhiệm Vụ Bí Mật
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#D4CEFF] via-[#A1CDED] to-[#D4CEFF] rounded-full shadow-sm"></div>
          </div>
          
          {/* Description */}
          <div className="bg-gradient-to-br from-[#D4CEFF]/10 to-[#A1CDED]/10 rounded-2xl p-6 mb-6 border border-[#D4CEFF]/30">
            <p className="text-gray-800 text-base leading-relaxed mb-3 font-semibold">
              Chúc mừng bạn đã hoàn thành nhiệm vụ! 🎉
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Bạn đã mở khóa thành công tính năng <span className="font-bold text-[#6B5FCF]">Nhiệm Vụ Bí Mật</span>. 
              Hệ thống sẽ tự động gửi các nhiệm vụ đặc biệt đến bạn theo lịch trình định kỳ để bạn có thể tiếp tục khám phá và nhận phần thưởng.
            </p>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-[#A1CDED]/10 to-[#D4CEFF]/10 rounded-xl p-5 mb-6 text-left border border-[#A1CDED]/30">
            <p className="text-gray-800 text-sm font-bold mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span>Tính năng nổi bật</span>
            </p>
            <ul className="text-gray-700 text-sm space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-[#6B5FCF] font-bold mt-0.5">•</span>
                <span>Nhận nhiệm vụ tự động theo lịch trình</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B5FCF] font-bold mt-0.5">•</span>
                <span>Phần thưởng độc quyền và đặc biệt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B5FCF] font-bold mt-0.5">•</span>
                <span>Trải nghiệm tương tác độc đáo và thú vị</span>
              </li>
            </ul>
          </div>

          {/* Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-[#6B5FCF] to-[#4A90E2] text-white font-bold py-4 px-6 rounded-xl hover:from-[#5A4FBF] hover:to-[#3A80D2] transition-all transform hover:scale-105 active:scale-95 shadow-lg text-lg hover:shadow-xl"
          >
            Khám Phá Ngay →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecretMissionPopup

