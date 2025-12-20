import { useState } from 'react'
import { api } from '../services'

// Helper for generating unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

const QuestionInputScreen = ({ onBack }) => {
    const [rows, setRows] = useState([
        { id: generateId(), content: '', category: 'TRUTH' }
    ])
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const categories = [
        { id: 'TRUTH', label: 'T', color: 'bg-blue-500', fullLabel: 'Sự thật' },
        { id: 'DARE', label: 'D', color: 'bg-red-500', fullLabel: 'Thử thách' },
        { id: 'CỎ 3 LÁ', label: 'C', color: 'bg-green-500', fullLabel: 'Cỏ 3 lá' }
    ]

    const handleAddRow = () => {
        setRows([...rows, { id: generateId(), content: '', category: 'TRUTH' }])
    }

    const handleDeleteRow = (id) => {
        if (rows.length === 1) {
            // Don't delete the last row, just clear it
            setRows([{ id: generateId(), content: '', category: 'TRUTH' }])
            return
        }
        setRows(rows.filter(r => r.id !== id))
    }

    const updateRow = (id, field, value) => {
        setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    const handleSubmit = async () => {
        // Filter empty rows
        const validRows = rows.filter(r => r.content.trim())

        if (validRows.length === 0) return

        setLoading(true)
        try {
            // Submit all valid rows in parallel
            await Promise.all(validRows.map(row => api.addQuestion(row.category, row.content)))

            setShowSuccess(true)
            // Reset to one empty row
            setRows([{ id: generateId(), content: '', category: 'TRUTH' }])
            setTimeout(() => setShowSuccess(false), 2000)
        } catch (error) {
            alert('Gửi câu hỏi thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 h-screen w-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] p-4 flex flex-col items-center relative overflow-hidden font-sans">

            {/* Back Button & Header */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-4 pt-2 relative">
                <button
                    onClick={onBack}
                    className="group relative z-10"
                >
                    <div className="relative transform transition-transform active:scale-95 duration-150">
                        <div className="absolute inset-0 bg-gray-400 rounded-full translate-y-1"></div>
                        <div className="relative bg-white border-2 border-gray-200 px-3 py-1.5 rounded-full font-bold text-gray-600 text-sm flex items-center gap-1 group-hover:-translate-y-0.5 transition-transform">
                            <span>←</span> Quay lại
                        </div>
                    </div>
                </button>

                <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 drop-shadow-sm absolute left-1/2 -translate-x-1/2 text-center w-full pointer-events-none">
                    Thêm Câu Hỏi
                </h1>

                {/* Info Button */}
                <button
                    onClick={() => setShowInfo(true)}
                    className="group relative z-10"
                >
                    <div className="relative transform transition-transform active:scale-95 duration-150">
                        <div className="absolute inset-0 bg-blue-400 rounded-full translate-y-1"></div>
                        <div className="relative bg-white border-2 border-blue-200 w-8 h-8 rounded-full font-black text-blue-500 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-sm">
                            i
                        </div>
                    </div>
                </button>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-3xl perspective-1000 flex-1 flex flex-col min-h-0">
                <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-4 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.5)] min-h-0">

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
                        {rows.map((row, index) => (
                            <div
                                key={row.id}
                                className="group relative flex items-center gap-2 md:gap-4 animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >

                                {/* Number */}
                                <div className="hidden md:flex items-center justify-center w-8 h-12 text-gray-400 font-bold">
                                    {index + 1}
                                </div>

                                {/* Input Container */}
                                <div className="flex-1 bg-white rounded-xl p-2 shadow-sm border border-gray-100 focus-within:shadow-md focus-within:border-purple-300 transition-all flex flex-col md:flex-row gap-3 items-center">

                                    {/* Category Selector */}
                                    <div className="flex shrink-0 p-1 bg-gray-50 rounded-lg self-center">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => updateRow(row.id, 'category', cat.id)}
                                                className={`relative w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs transition-all duration-200 ${row.category === cat.id
                                                    ? `${cat.color} text-white shadow-sm scale-110`
                                                    : 'text-gray-400 hover:text-gray-600'
                                                    }`}
                                                title={cat.fullLabel}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Text Input with Clear Button */}
                                    <div className="flex-1 flex items-center gap-2 relative">
                                        <textarea
                                            value={row.content}
                                            onChange={(e) => updateRow(row.id, 'content', e.target.value)}
                                            placeholder={`Nhập ${row.category === 'CỎ 3 LÁ' ? 'điều gì đó' : row.category === 'TRUTH' ? 'câu hỏi sự thật' : 'thử thách'}...`}
                                            rows={1}
                                            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-base font-medium placeholder-gray-400 resize-none min-h-[2.5rem] py-2 pr-8"
                                            style={{ minHeight: '40px' }}
                                            onInput={(e) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                        />
                                        {/* Clear Button - only show when content exists */}
                                        {row.content && (
                                            <button
                                                onClick={() => updateRow(row.id, 'content', '')}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all active:scale-95"
                                                title="Xóa nội dung"
                                            >
                                                <span className="text-sm">✕</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteRow(row.id)}
                                    className="w-8 h-8 flex shrink-0 items-center justify-center text-red-500 border border-red-500 bg-white rounded-full hover:bg-red-50 transition-colors shadow-sm active:scale-95"
                                >
                                    <span className="text-sm">✕</span>
                                </button>
                            </div>
                        ))}
                    </div>


                    {/* Summary Counts */}
                    <div className="flex justify-center gap-4 mb-4">
                        {categories.map(cat => {
                            const count = rows.filter(r => r.category === cat.id && r.content.trim()).length
                            if (count === 0) return null
                            return (
                                <div key={cat.id} className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold text-white ${cat.color} shadow-sm animate-fade-in`}>
                                    {cat.label}: {count}
                                </div>
                            )
                        })}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-white/30 flex gap-4">

                        <button
                            onClick={handleAddRow}
                            className="flex-1 group relative"
                        >
                            <div className="absolute inset-0 bg-gray-200 rounded-xl translate-y-1"></div>
                            <div className="relative bg-white border-2 border-gray-200 py-2.5 rounded-xl font-bold text-gray-500 text-sm flex items-center justify-center gap-2 active:translate-y-1 transition-transform group-hover:border-purple-200 group-hover:text-purple-500">
                                <span className="text-lg font-black">+</span> Thêm dòng
                            </div>
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-[2] group relative disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-purple-700 rounded-xl translate-y-1"></div>
                            <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg active:translate-y-1 transition-transform flex items-center justify-center gap-2">
                                {loading ? (
                                    <span className="animate-spin">⟳</span>
                                ) : (
                                    <>
                                        GỬI TẤT CẢ <span className="text-lg">🚀</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            {/* Info Modal */}
            {showInfo && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 max-w-md w-full shadow-2xl animate-pop-in relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowInfo(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold p-2"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">ℹ️</div>
                            <h2 className="text-xl font-black text-gray-800">Hướng dẫn</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-xl flex gap-3 items-center">
                                <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shrink-0 text-sm">T</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Sự thật (Truth)</h3>
                                    <p className="text-xs text-gray-600">Trả lời câu hỏi một cách trung thực nhất.</p>
                                </div>
                            </div>

                            <div className="bg-red-50 p-3 rounded-xl flex gap-3 items-center">
                                <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold shrink-0 text-sm">D</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Thử thách (Dare)</h3>
                                    <p className="text-xs text-gray-600">Thực hiện một hành động hoặc thử thách.</p>
                                </div>
                            </div>

                            <div className="bg-green-50 p-3 rounded-xl flex gap-3 items-center">
                                <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shrink-0 text-sm">C</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Cỏ 3 Lá</h3>
                                    <p className="text-xs text-gray-600">Các sự kiện ngẫu nhiên may mắn hoặc xui xẻo.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowInfo(false)}
                                className="bg-gray-100 border-2 border-blue-500 text-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Đã hiểu!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            {showSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 animate-fade-in">
                    <div className="text-center transform animate-bounce-in bg-white p-8 rounded-3xl shadow-2xl">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-3xl font-black text-gray-800 mb-2">Đã lưu!</h3>
                        <p className="text-gray-500 font-medium">Đã thêm câu hỏi thành công.</p>
                    </div>
                </div>
            )}

            {/* Decorative Background Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

        </div>
    )
}

export default QuestionInputScreen
