function SecretMissionPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute w-10 h-10 flex items-center justify-center rounded-full top-4 right-4 text-gray-400 hover:text-purple-600 text-xl font-semibold hover:bg-purple-50 transition-all duration-200 hover:scale-110"
          aria-label="Đóng"
        >
          ✕
        </button>
        
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Secret Mission</h2>
          <p className="text-gray-600 mb-6">
            Tính năng này đang được phát triển. Sẽ sớm có mặt!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecretMissionPopup
