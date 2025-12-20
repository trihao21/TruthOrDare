import { useState, useEffect, useRef } from 'react'
import { gameService } from '../services/gameService'
import { canvasService } from '../services/canvasService'

function WheelScreen({ onSpinComplete, onManage, onInput }) {
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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#B8D4E8] to-[#A4C4D8] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative clouds */}
      <div className="absolute top-20 left-10 w-32 h-16 bg-white/60 rounded-full blur-sm"></div>
      <div className="absolute top-32 left-24 w-24 h-12 bg-white/50 rounded-full blur-sm"></div>
      <div className="absolute top-20 right-10 w-40 h-20 bg-white/60 rounded-full blur-sm"></div>
      <div className="absolute top-36 right-28 w-28 h-14 bg-white/50 rounded-full blur-sm"></div>
      <div className="absolute bottom-20 left-20 w-36 h-18 bg-white/50 rounded-full blur-sm"></div>
      <div className="absolute bottom-20 right-16 w-32 h-16 bg-white/50 rounded-full blur-sm"></div>

      {/* Decorative elements */}
      <div className="absolute top-24 right-32 text-6xl opacity-40">🌙</div>
      <div className="absolute top-40 left-40 text-4xl opacity-30">⭐</div>
      <div className="absolute bottom-32 right-40 text-5xl opacity-30">✨</div>

      <div className="flex gap-4 absolute top-8 right-8 z-30">
        <button onClick={onInput} className="group relative">
          <div className="absolute inset-0 bg-purple-700 rounded-2xl translate-y-2"></div>
          <div className="relative bg-white border-2 border-purple-200 px-6 py-3 rounded-2xl font-bold text-purple-600 flex items-center gap-2 active:translate-y-2 transition-transform shadow-lg group-hover:-translate-y-1">
            <span className="text-2xl">+</span>
            <span>Thêm câu hỏi</span>
          </div>
        </button>

        <button onClick={onManage} className="group relative">
          <div className="absolute inset-0 bg-gray-700 rounded-2xl translate-y-2"></div>
          <div className="relative bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl font-bold text-gray-600 flex items-center gap-2 active:translate-y-2 transition-transform shadow-lg group-hover:-translate-y-1">
            <span className="text-xl">⚙️</span>
          </div>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-7xl font-black text-white mb-12 tracking-wider spin-title">SPIN TO WIN</h1>

      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-20">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-[#8B6DB8] drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <div className="wheel-container">
          <canvas ref={canvasRef} width="500" height="500"></canvas>

          {/* Center Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="spin-button"
          >
            <span className="text-5xl font-black text-white">GO</span>
          </button>
        </div>
      </div>

      {/* Decorative buildings */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-4 opacity-40 pointer-events-none">
        <div className="w-24 h-32 bg-[#8BA4C8] rounded-t-lg"></div>
        <div className="w-20 h-40 bg-[#9BB4D8] rounded-t-lg"></div>
        <div className="w-28 h-36 bg-[#8BA4C8] rounded-t-lg"></div>
        <div className="w-32 h-48 bg-[#7B94B8] rounded-t-lg"></div>
        <div className="w-24 h-44 bg-[#9BB4D8] rounded-t-lg"></div>
        <div className="w-20 h-32 bg-[#8BA4C8] rounded-t-lg"></div>
      </div>
    </div>
  )
}

export default WheelScreen
