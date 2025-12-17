import { useState, useEffect, useRef } from 'react'

const segments = [
  { label: 'TRUTH', percentage: 40, color: '#B8A4E8', textColor: '#6B4DB8' },
  { label: 'DARE', percentage: 40, color: '#A4D4E8', textColor: '#4D8DB8' },
  { label: 'CỎ 3 LÁ', percentage: 20, color: '#D4B8E8', textColor: '#8B4DB8' }
]

function WheelScreen({ onSpinComplete, onManage, onInput }) {
  const canvasRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)

  useEffect(() => {
    drawWheel(0)
  }, [])

  const drawWheel = (rotation = 0) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 220

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)

    let currentAngle = 0

    segments.forEach((segment) => {
      const sliceAngle = (segment.percentage / 100) * Math.PI * 2

      // Draw segment
      ctx.beginPath()
      ctx.arc(0, 0, radius, currentAngle, currentAngle + sliceAngle)
      ctx.lineTo(0, 0)
      ctx.fillStyle = segment.color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = '#8B9DC8'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.rotate(currentAngle + sliceAngle / 2)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = segment.textColor
      ctx.font = 'bold 32px Arial'
      ctx.fillText(segment.label, radius * 0.65, 0)
      ctx.font = 'bold 28px Arial'
      ctx.fillText(segment.percentage + '%', radius * 0.65, 35)
      ctx.restore()

      currentAngle += sliceAngle
    })

    // Draw outer ring with dots
    ctx.beginPath()
    ctx.arc(0, 0, radius + 15, 0, Math.PI * 2)
    ctx.strokeStyle = '#8B9DC8'
    ctx.lineWidth = 30
    ctx.stroke()

    // Draw dots on outer ring
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const dotX = Math.cos(angle) * (radius + 15)
      const dotY = Math.sin(angle) * (radius + 15)
      ctx.beginPath()
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#FFB4C8'
      ctx.fill()
    }

    ctx.restore()
  }

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)

    const spins = 5 + Math.random() * 3
    const extraDegrees = Math.random() * 360
    const totalRotation = spins * 360 + extraDegrees
    const duration = 4000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const rotation = (currentRotation + totalRotation * easeOut) * (Math.PI / 180)

      drawWheel(rotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        const newRotation = (currentRotation + totalRotation) % 360
        setCurrentRotation(newRotation)
        setIsSpinning(false)

        // Determine result
        const finalRotation = newRotation % 360
        const pointerAngle = (90 + finalRotation) % 360

        let cumulativeAngle = 0
        let result = segments[0]

        for (const segment of segments) {
          const segmentAngle = (segment.percentage / 100) * 360
          if (pointerAngle >= cumulativeAngle && pointerAngle < cumulativeAngle + segmentAngle) {
            result = segment
            break
          }
          cumulativeAngle += segmentAngle
        }

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
