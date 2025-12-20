function MissionUnlockModal({ mission, onClose }) {
  if (!mission) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[100] animate-fade-in overflow-y-auto">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#A1CDED] rounded-full animate-float opacity-80"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#D4CEFF] rounded-full animate-float-delay opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#A1CDED] rounded-full animate-float-delay-2 opacity-75"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-[#D4CEFF] rounded-full animate-float opacity-65"></div>
      </div>

      {/* Main Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 my-8">
        {/* Unlock Animation Container */}
        <div className="relative mb-6 flex justify-center">
          {/* Lock Icon - Animated */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] rounded-full blur-2xl opacity-60 animate-pulse"></div>
            
            {/* Lock breaking animation */}
            <div className="relative text-8xl animate-unlock-bounce">
              🔓
            </div>
            
            {/* Sparkles */}
            <div className="absolute -top-4 -right-4 text-3xl animate-spin-slow">✨</div>
            <div className="absolute -bottom-4 -left-4 text-2xl animate-spin-slow-delay">⭐</div>
            <div className="absolute top-1/2 -right-8 text-xl animate-bounce">💫</div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="bg-gradient-to-br from-white via-[#D4CEFF]/20 to-[#A1CDED]/20 rounded-3xl shadow-2xl p-8 border-2 border-[#D4CEFF] animate-pop-in relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4CEFF]/20 to-[#A1CDED]/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#A1CDED]/20 to-[#D4CEFF]/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <div className="relative z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <span className="text-xl font-bold">✕</span>
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] mb-2">
                🎉 Nhiệm Vụ Đã Mở Khóa!
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] mx-auto rounded-full"></div>
            </div>

            {/* Mission Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-[#D4CEFF] shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4CEFF] to-[#A1CDED] rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {mission.name === 'Đi ăn' ? '🍽️' : mission.name === 'Đi chụp photobooth' ? '📸' : '🍺'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-800 mb-1">
                    {mission.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <span>📍</span>
                    <span>{mission.location}</span>
                  </p>
                </div>
              </div>

              {/* Mission Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⏰</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Thời gian bắt đầu</p>
                    <p className="text-gray-600">
                      {new Date(mission.startTime).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">⏱️</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Thời gian kết thúc</p>
                    <p className="text-gray-600">
                      {new Date(mission.endTime).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">👥</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Số thành viên cần thiết</p>
                    <p className="text-gray-600">{mission.requiredMembers} người</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800 leading-relaxed">
                <span className="font-bold">📸 Hướng dẫn:</span> Khi đến địa điểm và đủ thành viên, hãy chụp ảnh để check-in. 
                Người chụp cuối cùng hoặc chụp sau thời gian quy định sẽ bị phạt!
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Bắt đầu nhiệm vụ! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionUnlockModal

