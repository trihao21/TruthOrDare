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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden" data-tour="card-screen">
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

      {/* Back Button with glassmorphism */}
      <button 
        onClick={onBack} 
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl" 
        data-tour="card-back-button"
      >
        <span className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <span>←</span>
          <span>Quay lại</span>
        </span>
      </button>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Title with modern styling */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-down">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight"
            style={{ 
              color: result.textColor,
              textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
              filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))'
            }}
          >
            {result.label}
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-medium">
            {!drawnCard ? 'Bốc một thẻ để xem câu hỏi hoặc thử thách' : 'Đây là câu hỏi/thử thách của bạn'}
          </p>
        </div>

        {/* Card Deck or Drawn Card */}
        <div className="card-deck-container mb-8 sm:mb-12 flex justify-center">
          {showDeck && !drawnCard && (
            <div className="card-deck-modern">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`card-in-deck-modern ${isDrawing ? 'shuffle' : ''}`}
                  style={{
                    transform: `translateY(${-i * 4}px) translateX(${-i * 3}px) rotate(${-i * 2}deg)`,
                    animationDelay: `${i * 100}ms`,
                    zIndex: 5 - i
                  }}
                >
                  <div className="card-pattern-modern"></div>
                </div>
              ))}
            </div>
          )}

          {drawnCard && (
            <div className="flip-card-modern flipped">
              <div className="flip-card-inner-modern">
                <div className="flip-card-back-modern">
                  <div className="card-pattern-modern"></div>
                </div>
                <div className="flip-card-front-modern">
                  <div className="mb-6">
                    <div 
                      className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4"
                      style={{ 
                        backgroundColor: `${result.textColor}20`,
                        color: result.textColor
                      }}
                    >
                      {result.label}
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-medium">
                    {drawnCard.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Draw Button with modern design */}
        {!drawnCard && (
          <div className="text-center">
            <button 
              onClick={drawCard} 
              disabled={isDrawing} 
              className="draw-button-modern group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                {isDrawing ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    <span>Đang bốc...</span>
                  </>
                ) : (
                  <>
                    <span>🎴</span>
                    <span>BỐC BÀI</span>
                  </>
                )}
              </span>
            </button>
          </div>
        )}

        {drawnCard && (
          <div className="text-center">
            <button 
              onClick={drawAgain} 
              className="draw-button-modern group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                <span>🔄</span>
                <span>BỐC LẠI</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardScreen
