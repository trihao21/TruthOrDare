function ResultScreen({ result }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#B8D4E8] to-[#A4C4D8] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="result-popup">
        <h2 className="text-8xl font-black mb-4" style={{ color: result.textColor }}>
          {result.label}
        </h2>
      </div>
    </div>
  )
}

export default ResultScreen
