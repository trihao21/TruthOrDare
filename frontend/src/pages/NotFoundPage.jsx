import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-white mb-4">404</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Trang không tồn tại
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/"
          className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage