import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { identityService } from '../services/identityService'
import { authService } from '../services'

function DrawPage() {
  const navigate = useNavigate()
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnIdentity, setDrawnIdentity] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [identitiesStatus, setIdentitiesStatus] = useState([])

  const handleNavigateToHome = useCallback(() => {
    // Clear manual logout flag
    identityService.clearManualLogout()
    // Set navigating state
    setIsNavigating(true)
    // Navigate to add-question page
    setTimeout(() => {
      navigate('/add-question')
    }, 300)
  }, [navigate])

  // Update identities status from backend
  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = await identityService.getAllIdentitiesStatus()
        setIdentitiesStatus(status)
      } catch (error) {
        console.error('Error updating status:', error)
        // Fallback to local
        const localStatus = identityService.getAllIdentitiesStatusLocal()
        setIdentitiesStatus(localStatus)
      }
    }
    
    // Update immediately
    updateStatus()
    // Update status frequently to reflect changes from other devices (every 500ms)
    const interval = setInterval(updateStatus, 500)
    
    return () => clearInterval(interval)
  }, [drawnIdentity, showResult])

  // Check if already has identity on mount (from backend)
  useEffect(() => {
    const checkIdentity = async () => {
      try {
        // Try to get from backend first
        const existing = await identityService.getCurrentIdentityFromBackend()
        if (existing) {
          setDrawnIdentity(existing)
          setShowResult(true)
          
          // Auto navigate if user hasn't manually logged out
          if (!identityService.hasManualLogout()) {
            // Small delay to show the identity card briefly before redirect
            setTimeout(() => {
              handleNavigateToHome()
            }, 1500)
          }
          // If hasManualLogout is true, wait for user to click button
        }
      } catch (error) {
        console.error('Error checking identity:', error)
        // Fallback to local
        const localExisting = identityService.getAssignedIdentity()
        if (localExisting) {
          setDrawnIdentity(localExisting)
          setShowResult(true)
        }
      }
    }
    
    checkIdentity()
  }, [handleNavigateToHome])

  const drawIdentity = async () => {
    if (isDrawing) return

    setIsDrawing(true)
    setDrawnIdentity(null)
    setShowResult(false)

    // Wait for animation
    setTimeout(async () => {
      try {
        // Generate temporary username for assignment
        const tempUsername = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        
        // Draw identity from backend
        const selected = await identityService.drawRandomIdentity(tempUsername)
        setDrawnIdentity(selected)
        setShowResult(true)
        setIsDrawing(false)

        // Force update status immediately after drawing
        try {
          const status = await identityService.getAllIdentitiesStatus()
          setIdentitiesStatus(status)
        } catch (error) {
          console.error('Error updating status after draw:', error)
        }

        // Clear manual logout flag when drawing new identity
        identityService.clearManualLogout()

        // Navigate to add-question page immediately after drawing
        setIsNavigating(true)
        setTimeout(() => {
          navigate('/add-question')
        }, 500)
      } catch (error) {
        console.error('Error drawing identity:', error)
        setIsDrawing(false)
        alert('Không thể bốc thăm. Vui lòng thử lại.')
      }
    }, 2000)
  }

  const handleGoToHome = () => {
    if (!drawnIdentity) return
    handleNavigateToHome()
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90"></div>
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* Title with Status Widget */}
        <div className="mb-8 sm:mb-12 animate-fade-in-down relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight text-white drop-shadow-lg flex-1 text-center">
              {showResult && drawnIdentity ? 'Identity Của Bạn' : 'Bốc Thăm Identity'}
            </h1>
            <div className="flex-1 flex justify-end">
              {/* Identity Status Grid - Small widget */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 shadow-lg">
                <h3 className="text-white font-bold text-xs mb-2 text-center">
                  Status
                </h3>
                <div className="grid grid-cols-4 gap-1">
                  {identitiesStatus.map((identity) => (
                    <div
                      key={identity.id}
                      className={`relative p-1 rounded border transition-all ${
                        identity.isCurrent
                          ? 'bg-white/30 border-white scale-110 shadow-md'
                          : identity.isTaken
                          ? 'bg-white/15 border-white/40 opacity-60'
                          : 'bg-white/5 border-white/20'
                      }`}
                      style={{
                        borderColor: identity.isCurrent ? identity.color : undefined
                      }}
                      title={identity.displayName}
                    >
                      <div className="text-center">
                        <div className="text-sm">
                          {identity.avatar}
                        </div>
                        {identity.isCurrent && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                        )}
                        {identity.isTaken && !identity.isCurrent && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-base sm:text-lg font-medium">
            {!showResult 
              ? 'Nhấn nút "Tham gia" để bốc thăm identity ngẫu nhiên' 
              : 'Identity đã được gán cho thiết bị này'}
          </p>
        </div>

        {/* Drawing Animation or Result */}
        <div className="mb-8 sm:mb-12 flex justify-center min-h-[300px] items-center">
          {isDrawing && !showResult && (
            <div className="text-center">
              <div className="animate-spin text-6xl sm:text-8xl mb-4">
                🎲
              </div>
              <p className="text-white/80 text-lg">Đang bốc thăm...</p>
            </div>
          )}

          {showResult && drawnIdentity && (
            <div className="w-full max-w-2xl">
              <div 
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border-2 text-center"
                style={{ borderColor: drawnIdentity.color }}
              >
                <div className="text-8xl sm:text-9xl mb-6">
                  {drawnIdentity.avatar}
                </div>
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
                  style={{ color: drawnIdentity.color }}
                >
                  {drawnIdentity.displayName}
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl font-mono">
                  {drawnIdentity.id}
                </p>
                <div className="mt-4 px-4 py-2 bg-gray-100 rounded-lg inline-block">
                  <p className="text-sm text-gray-600">
                    Identity đã được lưu vào thiết bị này
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isDrawing && !showResult && (
            <div className="text-center">
              <div className="text-6xl sm:text-8xl animate-bounce mb-4">
                🎴
              </div>
              <p className="text-white/80 text-lg">Sẵn sàng bốc thăm?</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="text-center">
            <button 
              onClick={drawIdentity} 
              disabled={isDrawing} 
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold text-xl sm:text-2xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative z-10 flex items-center gap-3">
                {isDrawing ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    <span>Đang bốc...</span>
                  </>
                ) : (
                  <>
                    <span>🎲</span>
                    <span>THAM GIA</span>
                  </>
                )}
              </span>
            </button>
          </div>
        )}

        {showResult && (
          <div className="text-center space-y-4">
            {isNavigating ? (
              <div className="px-8 py-4">
                <div className="flex items-center justify-center gap-3 text-white">
                  <span className="inline-block animate-spin text-2xl">⚡</span>
                  <span className="text-lg font-medium">Đang chuyển đến trang đặt câu hỏi...</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleGoToHome}
                disabled={isNavigating}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold text-lg sm:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs mx-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🏠</span>
                  <span>Về Trang Chủ</span>
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DrawPage

