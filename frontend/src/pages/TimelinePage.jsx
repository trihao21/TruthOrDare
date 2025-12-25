import { useState, useEffect, useRef } from 'react'

function TimelinePage() {
  // Timeline data
  const [timelineItems] = useState([
    {
      id: 1,
      title: 'Đi chụp photobooth',
      description: 'Bắt đầu hành trình với việc lưu giữ những khoảnh khắc đẹp tại studio. Cùng nhau tạo ra những bức ảnh kỷ niệm tuyệt vời!',
      image: '/timeline-1.jpg',
      date: '2025-01-21',
      time: '17:45',
      location: 'Studio',
      locationLink: 'https://maps.app.goo.gl/UFubKnCxNubksoK38?g_st=ipc'
    },
    {
      id: 2,
      title: 'Đi ăn',
      description: 'Tiếp tục với bữa ăn ngon tại nhà hàng. Thưởng thức những món ăn tuyệt vời và trò chuyện vui vẻ!',
      image: '/timeline-2.jpg',
      date: '2025-01-21',
      time: '19:00',
      location: 'Nhà hàng',
      locationLink: 'https://maps.app.goo.gl/mEbfYSKbZ6RchYPt5?g_st=ipc'
    },
    {
      id: 3,
      title: 'Boardgame',
      description: 'Cùng nhau chơi các trò chơi boardgame thú vị. Thử thách trí tuệ và tận hưởng những khoảnh khắc vui vẻ!',
      image: '/timeline-3.jpg',
      date: '2025-01-21',
      time: '21:00',
      location: 'Quán boardgame',
      locationLink: 'https://maps.app.goo.gl/vxMWfhxz7LuYRJmr5'
    },
    {
      id: 4,
      title: 'Homestay',
      description: 'Kết thúc đêm tại homestay ấm cúng. Cùng nhau nghỉ ngơi và tận hưởng không gian riêng tư!',
      image: '/timeline-4.jpg',
      date: '2025-01-22',
      time: '00:00',
      location: 'Homestay',
      locationLink: 'https://maps.app.goo.gl/bZowpEH5j2QaWija7'
    }
  ])

  const [visibleItems, setVisibleItems] = useState(new Set())
  const itemRefs = useRef([])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set([...prev, index]))
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -100px 0px'
        }
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6366F1] via-white to-[#EC4899] py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 overflow-hidden">
      {/* Decorative background elements with animation */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#EC4899]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-[#6366F1]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-float-slow-delay"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with animation */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-down">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#6366F1] mb-2 sm:mb-3 md:mb-4 animate-gradient-shift px-2">
            Timeline
          </h1>
          <div className="w-24 sm:w-28 md:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-[#EC4899] to-[#6366F1] mx-auto rounded-full animate-expand-width"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line with animation */}
          <div className="absolute left-4 sm:left-6 md:left-8 lg:left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-[#EC4899] to-[#6366F1] transform lg:-translate-x-1/2 animate-draw-line"></div>

          {/* Timeline Items */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
            {timelineItems.map((item, index) => {
              const isVisible = visibleItems.has(index)
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 transition-all duration-1000 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  {/* Timeline Dot with animation */}
                  <div className="absolute left-4 sm:left-6 md:left-8 lg:left-1/2 transform lg:-translate-x-1/2 -translate-y-1/2 top-0 lg:top-1/2 z-10">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-[#EC4899] to-[#6366F1] rounded-full border-2 sm:border-3 md:border-4 border-white shadow-lg transition-all duration-500 ${
                      isVisible ? 'scale-100 animate-pulse-slow' : 'scale-0'
                    }`}></div>
                    <div className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#EC4899] rounded-full animate-ping opacity-20 ${
                      isVisible ? 'block' : 'hidden'
                    }`}></div>
                    <div className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#6366F1] rounded-full animate-pulse opacity-30 ${
                      isVisible ? 'block' : 'hidden'
                    }`}></div>
                  </div>

                  {/* Content Card - Left side for even, Right side for odd (on desktop) */}
                  <div
                    className={`flex-1 w-full lg:w-5/12 transition-all duration-700 ml-8 sm:ml-10 md:ml-12 lg:ml-0 ${
                      isEven ? 'lg:mr-auto lg:pr-8' : 'lg:ml-auto lg:pl-8 lg:order-2'
                    } ${
                      isVisible
                        ? isEven
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-0 opacity-100'
                        : isEven
                        ? '-translate-x-10 opacity-0'
                        : 'translate-x-10 opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${index * 150 + 200}ms`
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 md:p-6 border-2 border-[#EC4899]/30 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 hover:border-[#6366F1]/50 group">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110">
                        <span className="text-xl sm:text-2xl animate-bounce-slow">📅</span>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 font-semibold transition-colors group-hover:text-[#EC4899]">{item.date}</p>
                          <p className="text-xs text-gray-400 transition-colors group-hover:text-[#6366F1]">{item.time}</p>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#6366F1] mb-2 sm:mb-3 transition-all duration-500 group-hover:scale-105 animate-gradient-shift">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-gray-800">
                        {item.description}
                      </p>

                      {/* Location */}
                      {item.location && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg sm:text-xl">📍</span>
                            <span className="text-xs sm:text-sm text-gray-600 font-semibold">{item.location}</span>
                          </div>
                          {item.locationLink && (
                            <a
                              href={item.locationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#6366F1] hover:text-[#EC4899] font-medium transition-all duration-300 decoration-2 underline-offset-2 cursor-pointer hover:bg-[#6366F1]/10 px-2 py-1 rounded-md hover:decoration-[#EC4899] flex items-center gap-1 break-words sm:break-all"
                            >
                              <span className="truncate sm:inline">{item.locationLink}</span>
                              <span className="text-xs shrink-0">🔗</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Card - Right side for even, Left side for odd (on desktop) */}
                  <div
                    className={`flex-1 w-full lg:w-5/12 transition-all duration-700 ml-8 sm:ml-10 md:ml-12 lg:ml-0 ${
                      isEven ? 'lg:ml-auto lg:pl-8 lg:order-2' : 'lg:mr-auto lg:pr-8'
                    } ${
                      isVisible
                        ? isEven
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-0 opacity-100'
                        : isEven
                        ? 'translate-x-10 opacity-0'
                        : '-translate-x-10 opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${index * 150 + 400}ms`
                    }}
                  >
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#6366F1]/30 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 hover:border-[#EC4899]/50 group">
                      <div className="aspect-video overflow-hidden relative">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }

        @keyframes drawLine {
          from {
            height: 0;
          }
          to {
            height: 100%;
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes floatSlowDelay {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(20px) translateX(-10px);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-expand-width {
          animation: expandWidth 1s ease-out;
        }

        .animate-draw-line {
          animation: drawLine 1.5s ease-out;
        }

        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-float-slow-delay {
          animation: floatSlowDelay 8s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default TimelinePage

