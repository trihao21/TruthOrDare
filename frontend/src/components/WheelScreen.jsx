import { useState, useEffect, useRef } from 'react'
import { gameService } from '../services/gameService'
import { canvasService } from '../services/canvasService'

function WheelScreen({ onSpinComplete }) {
  const canvasRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)

  useEffect(() => {
    canvasService.drawWheel(canvasRef.current, gameService.segments, 0)
  }, [])

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)

    const { totalRotation, duration } = gameService.generateSpinParams()
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOut = gameService.easeOut(progress)
      const rotation = (currentRotation + totalRotation * easeOut) * (Math.PI / 180)

      canvasService.drawWheel(canvasRef.current, gameService.segments, rotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        const newRotation = (currentRotation + totalRotation) % 360
        setCurrentRotation(newRotation)
        setIsSpinning(false)

        const result = gameService.calculateResult(newRotation)

        setTimeout(() => {
          onSpinComplete(result)
        }, 500)
      }
    }

    animate()
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
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glassmorphism container */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title with modern styling */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-down">
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight" 
            data-tour="wheel-title"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #fce7f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 80px rgba(255, 255, 255, 0.3)',
              filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.2))'
            }}
          >
            SPIN TO WIN
          </h1>
          <p className="text-white/80 text-lg sm:text-xl font-medium">
            Quay vòng quay để bắt đầu cuộc phiêu lưu
          </p>
        </div>

        {/* Wheel Container with glassmorphism */}
        <div className="relative flex justify-center items-center">
          {/* Glow effect behind wheel */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-full blur-3xl scale-150 animate-pulse-slow"></div>
          
          {/* Glassmorphism card */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 sm:-translate-y-8 z-30">
              <div className="relative">
                <div className="w-0 h-0 border-l-[16px] sm:border-l-[20px] border-l-transparent border-r-[16px] sm:border-r-[20px] border-r-transparent border-t-[32px] sm:border-t-[40px] border-t-white drop-shadow-2xl"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2"></div>
              </div>
            </div>

            {/* Wheel */}
            <div className="wheel-container">
              <canvas 
                ref={canvasRef} 
                width="500" 
                height="500" 
                className="drop-shadow-2xl"
                data-tour="wheel-canvas"
              ></canvas>

              {/* Center Button with modern design */}
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="spin-button-modern group"
                data-tour="wheel-spin-button"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <span className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                  {isSpinning ? (
                    <span className="inline-block animate-spin">⚡</span>
                  ) : (
                    'GO'
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-2xl">🎯</span>
            <span className="text-white/90 text-sm sm:text-base font-medium">
              Nhấn GO để quay vòng quay may mắn
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WheelScreen
