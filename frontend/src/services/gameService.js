// Game logic and utilities
export const gameService = {
  // Wheel segments configuration
  segments: [
    { label: 'TRUTH', percentage: 40, color: '#B8A4E8', textColor: '#6B4DB8' },
    { label: 'DARE', percentage: 40, color: '#A4D4E8', textColor: '#4D8DB8' },
    { label: 'CỎ 3 LÁ', percentage: 20, color: '#D4B8E8', textColor: '#8B4DB8' }
  ],

  // Calculate spin result based on rotation
  calculateResult(rotation) {
    const finalRotation = rotation % 360
    const pointerAngle = (90 + finalRotation) % 360

    let cumulativeAngle = 0
    let result = this.segments[0]

    for (const segment of this.segments) {
      const segmentAngle = (segment.percentage / 100) * 360
      if (pointerAngle >= cumulativeAngle && pointerAngle < cumulativeAngle + segmentAngle) {
        result = segment
        break
      }
      cumulativeAngle += segmentAngle
    }

    return result
  },

  // Generate random spin parameters
  generateSpinParams() {
    const spins = 5 + Math.random() * 3
    const extraDegrees = Math.random() * 360
    const totalRotation = spins * 360 + extraDegrees
    const duration = 4000

    return { totalRotation, duration }
  },

  // Easing function for smooth animation
  easeOut(progress) {
    return 1 - Math.pow(1 - progress, 3)
  },

  // Get random question from array
  getRandomQuestion(questions) {
    if (!questions || questions.length === 0) {
      return { content: 'Không có câu hỏi nào!' }
    }
    return questions[Math.floor(Math.random() * questions.length)]
  }
}