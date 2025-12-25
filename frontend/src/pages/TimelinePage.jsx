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
      time: '18:00',
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
      location: 'Quán ăn',
      locationLink: 'https://maps.app.goo.gl/mEbfYSKbZ6RchYPt5?g_st=ipc'
    },
    {
      id: 3,
      title: 'Boardgame',
      description: 'Cùng nhau chơi các trò chơi boardgame thú vị. Thử thách trí tuệ và tận hưởng những khoảnh khắc vui vẻ!',
      image: '/timeline-3.jpg',
      date: '2025-01-21',
      time: '20:00',
      location: 'Quán boardgame',
      locationLink: 'https://maps.app.goo.gl/vxMWfhxz7LuYRJmr5'
    },
    {
      id: 4,
      title: 'Homestay',
      description: 'Kết thúc đêm tại homestay ấm cúng. Cùng nhau nghỉ ngơi và tận hưởng không gian riêng tư!',
      image: '/timeline-4.jpg',
      date: '2025-01-22',
      time: '23:30',
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 md:px-6 overflow-x-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90"></div>
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-2xl lg:max-w-5xl mx-auto relative z-10">
        {/* Header with modern styling */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 animate-fade-in-down">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 tracking-tight">
            <span 
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #fce7f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3))'
              }}
            >
              Timeline
            </span>
          </h1>
          <div className="w-24 sm:w-32 md:w-40 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mx-auto rounded-full animate-expand-width shadow-lg shadow-purple-500/50"></div>
        </div>

        {/* Timeline Container - Mobile optimized */}
        <div className="relative">
          {/* Vertical Line with glow effect */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-indigo-500 transform -translate-x-1/2 animate-draw-line shadow-lg shadow-purple-500/50"></div>
          
          {/* Mobile: Vertical Line */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-indigo-500 animate-draw-line shadow-lg shadow-purple-500/50"></div>

          {/* Timeline Items */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            {timelineItems.map((item, index) => {
              const isVisible = visibleItems.has(index)
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={`relative transition-all duration-1000 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  {/* Timeline Dot with glow - Mobile optimized */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-0 md:top-1/2 z-20">
                    <div className={`relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-full border-3 md:border-4 border-white shadow-2xl transition-all duration-500 ${
                      isVisible ? 'scale-100 animate-pulse-slow' : 'scale-0'
                    }`}
                    style={{
                      boxShadow: isVisible ? '0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)' : 'none'
                    }}>
                    </div>
                    {isVisible && (
                      <>
                        <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-purple-400 rounded-full animate-ping opacity-30"></div>
                        <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
                      </>
                    )}
                  </div>

                  {/* Main Card - Mobile: Combined card, Desktop: Split layout */}
                  <div className={`md:flex md:items-center md:gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Content Section */}
                    <div className={`w-full md:w-5/12 transition-all duration-700 pl-12 md:pl-0 ${
                      isVisible
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-10 opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${index * 150 + 200}ms`
                    }}>
                      {/* Mobile: Combined Card with Image */}
                      <div className="md:hidden bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 group hover:bg-white/15 transition-all duration-500">
                        {/* Image with gradient overlay */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          {/* Date Badge on Image */}
                          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-white/30">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📅</span>
                              <div>
                                <p className="text-xs text-white font-bold">{item.date}</p>
                                <p className="text-xs text-white/80">{item.time}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4 sm:p-5">
                          <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">
                            <span 
                              className="inline-block"
                              style={{
                                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}
                            >
                              {item.title}
                            </span>
                          </h3>
                          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-3 sm:mb-4">
                            {item.description}
                          </p>
                          {item.location && (
                            <div className="pt-3 sm:pt-4 border-t border-white/20">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">📍</span>
                                <span className="text-sm text-white/80 font-semibold">{item.location}</span>
                              </div>
                              {item.locationLink && (
                                <a
                                  href={item.locationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-300 hover:text-pink-300 font-medium transition-all duration-300 hover:bg-white/10 px-2 py-1.5 rounded-lg break-all"
                                >
                                  <span className="break-all">{item.locationLink}</span>
                                  <span className="text-xs shrink-0">🔗</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop: Content Card Only */}
                      <div className="hidden md:block bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20 group hover:bg-white/15 transition-all duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">📅</span>
                          <div>
                            <p className="text-sm text-white/90 font-bold">{item.date}</p>
                            <p className="text-xs text-white/70">{item.time}</p>
                          </div>
                        </div>
                        <h3 className="text-2xl font-black mb-3">
                          <span 
                            className="inline-block"
                            style={{
                              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}
                          >
                            {item.title}
                          </span>
                        </h3>
                        <p className="text-base text-white/90 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        {item.location && (
                          <div className="pt-4 border-t border-white/20">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">📍</span>
                              <span className="text-sm text-white/80 font-semibold">{item.location}</span>
                            </div>
                            {item.locationLink && (
                              <a
                                href={item.locationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-purple-300 hover:text-pink-300 font-medium transition-all duration-300 hover:bg-white/10 px-2 py-1.5 rounded-lg break-all"
                              >
                                <span className="break-all">{item.locationLink}</span>
                                <span className="text-xs shrink-0">🔗</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop: Image Section */}
                    <div className={`hidden md:block w-5/12 transition-all duration-700 ${
                      isVisible
                        ? 'translate-x-0 opacity-100'
                        : isEven ? 'translate-x-10 opacity-0' : '-translate-x-10 opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${index * 150 + 400}ms`
                    }}>
                      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group hover:scale-105 transition-all duration-500">
                        <div className="aspect-video overflow-hidden relative">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
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
            width: 10rem;
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-expand-width {
          animation: expandWidth 1.2s ease-out;
        }

        .animate-draw-line {
          animation: drawLine 2s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default TimelinePage

