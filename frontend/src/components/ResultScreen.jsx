function ResultScreen({ result }) {
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

      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ffd93d'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Result display with glassmorphism */}
      <div className="relative z-10 text-center animate-fade-in-scale">
        <div className="inline-block bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
          <div className="mb-6">
            <div className="inline-block text-6xl sm:text-8xl animate-bounce-slow">
              🎉
            </div>
          </div>
          <h2 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight"
            style={{ 
              color: result.textColor,
              textShadow: '0 0 40px rgba(255, 255, 255, 0.5)',
              filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))'
            }}
          >
            {result.label}
          </h2>
          <p className="text-white/80 text-lg sm:text-xl font-medium">
            Chuẩn bị cho thử thách tiếp theo!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultScreen
