import { useState, useEffect, useRef } from 'react'

function TimelinePage() {
  // Timeline data - sẽ được điền sau
  const [timelineItems] = useState([
    {
      id: 1,
      title: 'Timeline Item 1',
      description: 'Mô tả cho timeline item 1 sẽ được điền vào đây',
      image: '/placeholder-image-1.jpg', // Placeholder - sẽ thay thế sau
      date: '2025-01-01',
      time: '17:45',
      location: 'Nhà hàng'
    },
    {
      id: 2,
      title: 'Timeline Item 2',
      description: 'Mô tả cho timeline item 2 sẽ được điền vào đây',
      image: '/timeline-2.webp', // Placeholder - sẽ thay thế sau
      date: '2025-01-02',
      time: '19:00',
      location: 'Studio',
      locationLink: 'https://maps.app.goo.gl/kjTSDZ6aPy9zhXr39'
    },
    {
      id: 3,
      title: 'Timeline Item 3',
      description: 'Mô tả cho timeline item 3 sẽ được điền vào đây',
      image: '/timeline-3.jpg', // Placeholder - sẽ thay thế sau
      date: '2025-01-03',
      time: '23:30',
      location: 'Quán bar',
      locationLink: 'https://maps.app.goo.gl/XnvtAMzo7jRDjGgK6'
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
    <div className="min-h-screen bg-gradient-to-br from-[#6366F1] via-white to-[#EC4899] py-12 px-4 overflow-hidden">
      {/* Decorative background elements with animation */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#EC4899]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-float-slow-delay"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with animation */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#6366F1] mb-4 animate-gradient-shift">
            Timeline
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-[#EC4899] to-[#6366F1] mx-auto rounded-full animate-expand-width"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line with animation */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#EC4899] to-[#6366F1] transform md:-translate-x-1/2 animate-draw-line"></div>

          {/* Timeline Items */}
          <div className="space-y-16">
            {timelineItems.map((item, index) => {
              const isVisible = visibleItems.has(index)
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 transition-all duration-1000 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  {/* Timeline Dot with animation */}
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-12 md:top-1/2 z-10">
                    <div className={`w-6 h-6 bg-gradient-to-br from-[#EC4899] to-[#6366F1] rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                      isVisible ? 'scale-100 animate-pulse-slow' : 'scale-0'
                    }`}></div>
                    <div className={`absolute inset-0 w-6 h-6 bg-[#EC4899] rounded-full animate-ping opacity-20 ${
                      isVisible ? 'block' : 'hidden'
                    }`}></div>
                    <div className={`absolute inset-0 w-6 h-6 bg-[#6366F1] rounded-full animate-pulse opacity-30 ${
                      isVisible ? 'block' : 'hidden'
                    }`}></div>
                  </div>

                  {/* Content Card - Left side for even, Right side for odd (on desktop) */}
                  <div
                    className={`flex-1 w-full md:w-5/12 transition-all duration-700 ${
                      isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8 md:order-2'
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
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border-2 border-[#EC4899]/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#6366F1]/50 group">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2 mb-4 transition-all duration-500 group-hover:scale-110">
                        <span className="text-2xl animate-bounce-slow">📅</span>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold transition-colors group-hover:text-[#EC4899]">{item.date}</p>
                          <p className="text-xs text-gray-400 transition-colors group-hover:text-[#6366F1]">{item.time}</p>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#6366F1] mb-3 transition-all duration-500 group-hover:scale-105 animate-gradient-shift">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed mb-4 transition-colors duration-300 group-hover:text-gray-800">
                        {item.description}
                      </p>

                      {/* Location */}
                      {item.location && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📍</span>
                            <span className="text-sm text-gray-600 font-semibold">{item.location}</span>
                          </div>
                          {item.locationLink && (
                            <a
                              href={item.locationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#6366F1] hover:text-[#EC4899] font-medium transition-all duration-300 decoration-2 underline-offset-2 cursor-pointer hover:bg-[#6366F1]/10 px-2 py-1 rounded-md hover:decoration-[#EC4899] flex items-center gap-1 break-all"
                            >
                              {item.locationLink}
                              <span className="text-xs shrink-0">🔗</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Card - Right side for even, Left side for odd (on desktop) */}
                  <div
                    className={`flex-1 w-full md:w-5/12 transition-all duration-700 ${
                      isEven ? 'md:ml-auto md:pl-8 md:order-2' : 'md:mr-auto md:pr-8'
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
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#6366F1]/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#EC4899]/50 group">
                      <div className="aspect-video overflow-hidden relative">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

