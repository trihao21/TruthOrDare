import { useState } from 'react'
import { gameService } from '../services/gameService'

function CardScreen({ result, questions, onBack }) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCard, setDrawnCard] = useState(null)
  const [showDeck, setShowDeck] = useState(true)

  const drawCard = () => {
    if (isDrawing || questions.length === 0) return

    setIsDrawing(true)
    setShowDeck(false)

    // Shuffle animation delay
    setTimeout(() => {
      const randomQuestion = gameService.getRandomQuestion(questions)
      setDrawnCard(randomQuestion)
      setIsDrawing(false)
    }, 800)
  }

  const drawAgain = () => {
    setDrawnCard(null)
    setShowDeck(true)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#B8D4E8] to-[#A4C4D8] flex flex-col items-center justify-center p-8 relative overflow-hidden" data-tour="card-screen">
      {/* Decorative clouds */}
      <div className="absolute top-20 left-10 w-32 h-16 bg-white/60 rounded-full blur-sm"></div>
      <div className="absolute top-20 right-10 w-40 h-20 bg-white/60 rounded-full blur-sm"></div>

      {/* Back Button */}
      <button onClick={onBack} className="back-button" data-tour="card-back-button">
        <span className="text-xl font-bold text-white">← Quay lại</span>
      </button>

      {/* Title */}
      <h1 className="text-6xl font-black mb-16" style={{ color: result.textColor }}>
        {result.label}
      </h1>

      {/* Card Deck or Drawn Card */}
      <div className="card-deck-container mb-12">
        {showDeck && !drawnCard && (
          <div className="card-deck">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`card-in-deck ${isDrawing ? 'shuffle' : ''}`}
                style={{
                  transform: `translateY(${-i * 3}px) translateX(${-i * 2}px)`,
                  animationDelay: `${i * 100}ms`
                }}
              ></div>
            ))}
          </div>
        )}

        {drawnCard && (
          <div className="flip-card flipped">
            <div className="flip-card-inner">
              <div className="flip-card-back">
                <div className="card-pattern"></div>
              </div>
              <div className="flip-card-front">
                <h3 className="text-3xl font-bold mb-6" style={{ color: result.textColor }}>
                  {result.label}
                </h3>
                <p className="text-2xl text-gray-700 leading-relaxed">
                  {drawnCard.content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Draw Button */}
      {!drawnCard && (
        <button onClick={drawCard} disabled={isDrawing} className="draw-button">
          <span className="text-4xl font-bold text-white">BỐC BÀI</span>
        </button>
      )}

      {drawnCard && (
        <button onClick={drawAgain} className="draw-button">
          <span className="text-4xl font-bold text-white">BỐC LẠI</span>
        </button>
      )}
    </div>
  )
}

export default CardScreen
