import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { identityService } from '../services/identityService'

function JoinPage() {
  const navigate = useNavigate()
  const [myIdentity, setMyIdentity] = useState(null)
  const [availableCount, setAvailableCount] = useState(0)
  const [totalCount] = useState(8)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    // Khởi tạo identities
    identityService.initialize()
    
    // Kiểm tra xem đã bốc chưa
    const identity = identityService.getMyIdentity()
    if (identity) {
      setMyIdentity(identity)
    }

    // Cập nhật số lượng còn lại
    updateAvailableCount()
  }, [])

  const updateAvailableCount = () => {
    const available = identityService.getAvailableIdentities()
    setAvailableCount(available.length)
  }

  const handleJoin = () => {
    setIsDrawing(true)
    
    // Thêm delay nhỏ để tạo hiệu ứng
    setTimeout(() => {
      const result = identityService.drawRandomIdentity()
      
      if (result.success) {
        setMyIdentity(result.identity)
        updateAvailableCount()
      } else {
        alert(result.error)
      }
      
      setIsDrawing(false)
    }, 500)
  }

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      black: 'bg-gray-900',
      white: 'bg-gray-100 border-2 border-gray-300'
    }
    return colorMap[color] || 'bg-gray-500'
  }

  const getTextColorClass = (color) => {
    return color === 'white' || color === 'yellow' ? 'text-gray-900' : 'text-white'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-3 text-white drop-shadow-lg">
              🎭 Bốc Thăm Identity
            </h1>
            <p className="text-white/80 text-sm">
              Còn lại: {availableCount}/{totalCount} identity
            </p>
          </div>

          {/* Result Display */}
          {myIdentity ? (
            <div className="text-center">
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getColorClass(myIdentity.color)} ${getTextColorClass(myIdentity.color)} text-6xl mb-4 shadow-2xl transform transition-all duration-500 hover:scale-110`}>
                  {myIdentity.avatar}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {myIdentity.avatar} Player {myIdentity.colorName}
                </h2>
                <p className="text-white/70 text-sm">
                  Đây là identity của bạn
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
                <p className="text-white/90 text-sm mb-2">
                  <strong>Lưu ý:</strong>
                </p>
                <ul className="text-white/70 text-xs text-left space-y-1">
                  <li>• Identity đã được gắn với thiết bị này</li>
                  <li>• Bạn không thể đổi identity</li>
                  <li>• Identity này không hiển thị cho người khác</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Về trang chủ
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">🎲</div>
                <p className="text-white/90 text-base mb-2">
                  Sẵn sàng bốc thăm?
                </p>
                <p className="text-white/70 text-sm">
                  Hệ thống sẽ random một identity ngẫu nhiên cho bạn
                </p>
              </div>

              <button
                onClick={handleJoin}
                disabled={isDrawing || availableCount === 0}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                {isDrawing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🎲</span>
                    <span>Đang bốc thăm...</span>
                  </span>
                ) : availableCount === 0 ? (
                  'Đã hết identity'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🎯</span>
                    <span>Tham gia</span>
                  </span>
                )}
              </button>

              {availableCount === 0 && (
                <p className="text-white/70 text-sm mt-4">
                  Tất cả 8 identity đã được bốc hết!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default JoinPage

