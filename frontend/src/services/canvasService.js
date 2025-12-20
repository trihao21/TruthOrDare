// Canvas drawing utilities for the wheel
export const canvasService = {
  // Draw the spinning wheel
  drawWheel(canvas, segments, rotation = 0) {
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

    // Draw segments
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
    this.drawOuterRing(ctx, radius)

    ctx.restore()
  },

  // Draw decorative outer ring with dots
  drawOuterRing(ctx, radius) {
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
  }
}