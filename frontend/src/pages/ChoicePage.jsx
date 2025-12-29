import { Link } from 'react-router-dom'

function ChoicePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <span className="text-white font-bold text-3xl md:text-4xl drop-shadow-lg">T</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              Truth or Dare
            </h1>
            <p className="text-gray-600 text-lg">Chào mừng bạn đến với trò chơi!</p>
          </div>

          {/* Choice Options */}
          <div className="space-y-4">
            {/* Option 1: Đã có tài khoản */}
            <Link
              to="/login"
              className="block group"
            >
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔑</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-white mb-1">Đã có tài khoản</h2>
                      <p className="text-white/80 text-sm">Đăng nhập với tài khoản của bạn</p>
                    </div>
                  </div>
                  <div className="text-white text-2xl group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </Link>

            {/* Option 2: Random lấy tài khoản */}
            <Link
              to="/draw"
              className="block group"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎲</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-white mb-1">Random lấy tài khoản</h2>
                      <p className="text-white/80 text-sm">Bốc thăm để nhận tài khoản ngẫu nhiên</p>
                    </div>
                  </div>
                  <div className="text-white text-2xl group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              💡 <strong>Lưu ý:</strong> Nếu bạn chưa có tài khoản, hãy chọn "Random lấy tài khoản" để bốc thăm và nhận tài khoản mới.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChoicePage




