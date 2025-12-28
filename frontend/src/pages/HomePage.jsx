import { useState, useEffect } from 'react'
import WheelScreen from '../components/WheelScreen'
import ResultScreen from '../components/ResultScreen'
import CardScreen from '../components/CardScreen'
import TourGuide from '../components/TourGuide'
import { tourService } from '../services/tourService'

function HomePage({ questions, onQuestionsUpdate }) {
  const [screen, setScreen] = useState('wheel')
  const [selectedResult, setSelectedResult] = useState(null)

  const handleSpinComplete = (result) => {
    setSelectedResult(result)
    setScreen('result')
    setTimeout(() => {
      setScreen('cards')
    }, 1000)
  }

  const handleBackToWheel = () => {
    setScreen('wheel')
    setSelectedResult(null)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Wheel Screen */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          screen === 'wheel' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <WheelScreen
          onSpinComplete={handleSpinComplete}
        />
        <TourGuide
          tourName="home-wheel"
          steps={[
            {
              target: '[data-tour="wheel-title"]',
              content: 'Chào mừng bạn đến với trang chủ! Đây là vòng quay may mắn. Bạn sẽ quay để chọn một trong các loại: Truth (Sự thật), Dare (Thử thách), hoặc Cỏ 3 lá.',
              allowClickOutside: false
            },
            {
              target: '[data-tour="wheel-canvas"]',
              content: 'Đây là vòng quay với các phần khác nhau. Mỗi phần tương ứng với một loại câu hỏi hoặc thử thách.',
              allowClickOutside: false
            },
            {
              target: '[data-tour="wheel-spin-button"]',
              content: 'Nhấn nút "GO" ở giữa vòng quay để bắt đầu quay! Sau khi quay, bạn sẽ nhận được một loại câu hỏi hoặc thử thách tương ứng.',
              allowClickOutside: false
            }
          ]}
          onComplete={() => {}}
          autoStart={!tourService.isTourCompleted('home-wheel')}
        />
      </div>

      {/* Result Screen */}
      {selectedResult && (
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            screen === 'result' ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <ResultScreen result={selectedResult} />
        </div>
      )}

      {/* Cards Screen */}
      {selectedResult && (
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            screen === 'cards' ? 'opacity-100 z-30' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <CardScreen
            result={selectedResult}
            questions={questions[selectedResult.label]}
            onBack={handleBackToWheel}
          />
          <TourGuide
            tourName="home-cards"
            steps={[
              {
                target: '[data-tour="card-screen"]',
                content: `Bạn đã quay được: ${selectedResult.label}! Đây là màn hình hiển thị câu hỏi hoặc thử thách. Bạn sẽ thấy các thẻ câu hỏi ở đây.`,
                allowClickOutside: false
              },
              {
                target: '[data-tour="card-back-button"]',
                content: 'Sau khi xem xong, bạn có thể nhấn nút "Quay lại" để quay vòng quay mới và tiếp tục chơi!',
                allowClickOutside: false
              }
            ]}
            onComplete={() => {}}
            autoStart={!tourService.isTourCompleted('home-cards')}
          />
        </div>
      )}
    </div>
  )
}

export default HomePage