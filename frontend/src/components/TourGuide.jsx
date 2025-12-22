import { useState, useEffect, useRef, useCallback } from 'react'
import { tourService } from '../services/tourService'

function TourGuide({ 
  tourName, 
  steps = [], 
  onComplete, 
  onSkip,
  autoStart = true,
  showSkip = true 
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [highlightPosition, setHighlightPosition] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
  const overlayRef = useRef(null)
  const tooltipRef = useRef(null)

  const calculateTooltipPosition = (elementRect) => {
    const tooltipWidth = 384 // max-w-sm = 384px
    const tooltipHeight = 250 // estimated height
    const padding = 20
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top, left, transform

    // Try positions: bottom, top, right, left, center
    const positions = [
      {
        // Bottom
        top: elementRect.bottom + padding,
        left: elementRect.left,
        transform: 'none',
        check: () => elementRect.bottom + padding + tooltipHeight <= viewportHeight
      },
      {
        // Top
        top: elementRect.top - tooltipHeight - padding,
        left: elementRect.left,
        transform: 'none',
        check: () => elementRect.top - tooltipHeight - padding >= 0
      },
      {
        // Right
        top: elementRect.top,
        left: elementRect.right + padding,
        transform: 'none',
        check: () => elementRect.right + padding + tooltipWidth <= viewportWidth
      },
      {
        // Left
        top: elementRect.top,
        left: elementRect.left - tooltipWidth - padding,
        transform: 'none',
        check: () => elementRect.left - tooltipWidth - padding >= 0
      },
      {
        // Center (fallback)
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        check: () => true
      }
    ]

    // Find first valid position
    const validPosition = positions.find(pos => pos.check())

    if (validPosition) {
      if (typeof validPosition.top === 'string') {
        return {
          top: validPosition.top,
          left: validPosition.left,
          transform: validPosition.transform
        }
      } else {
        // Ensure tooltip stays within viewport
        const finalTop = Math.max(padding, Math.min(validPosition.top, viewportHeight - tooltipHeight - padding))
        const finalLeft = Math.max(padding, Math.min(validPosition.left, viewportWidth - tooltipWidth - padding))
        
        return {
          top: `${finalTop}px`,
          left: `${finalLeft}px`,
          transform: validPosition.transform
        }
      }
    }

    // Fallback to center
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const handleComplete = useCallback(() => {
    setIsActive(false)
    tourService.completeTour(tourName)
    tourService.resetCurrentStep(tourName)
    if (onComplete) onComplete()
  }, [tourName, onComplete])

  const updateHighlight = useCallback(() => {
    if (currentStep >= steps.length) {
      handleComplete()
      return
    }

    const step = steps[currentStep]
    if (!step.target) {
      setHighlightPosition(null)
      setTooltipPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
      return
    }

    const element = typeof step.target === 'string' 
      ? document.querySelector(step.target)
      : step.target

    if (element) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        
        // Check if element is significantly outside viewport
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        const padding = 100 // Padding to ensure element is comfortably visible
        const isElementSignificantlyOutside = (
          rect.bottom < padding ||
          rect.top > viewportHeight - padding ||
          rect.right < padding ||
          rect.left > viewportWidth - padding
        )
        
        // Only scroll if element is significantly outside viewport (to avoid constant scrolling)
        if (isElementSignificantlyOutside) {
          // Smooth scroll to bring element into view
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }
        
        // Always update position based on current viewport position
        // Use getBoundingClientRect directly (no scroll offset) since we're using fixed positioning
        const highlightPos = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
        setHighlightPosition(highlightPos)

        // Calculate tooltip position based on current viewport position
        const tooltipPos = calculateTooltipPosition(rect)
        setTooltipPosition(tooltipPos)
      })
    } else {
      setHighlightPosition(null)
      setTooltipPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
    }
  }, [currentStep, steps, handleComplete])

  useEffect(() => {
    // Always show tour if not completed, regardless of autoStart
    if (!tourService.isTourCompleted(tourName)) {
      const savedStep = tourService.getCurrentStep(tourName)
      setCurrentStep(savedStep)
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        setIsActive(true)
      }, 300)
    }
  }, [tourName])

  useEffect(() => {
    if (isActive && steps.length > 0) {
      updateHighlight()
    }
  }, [currentStep, isActive, steps, updateHighlight])

  // Update position on scroll and resize
  useEffect(() => {
    if (!isActive || steps.length === 0) return

    let timeoutId
    let rafId
    const handleUpdate = () => {
      clearTimeout(timeoutId)
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          updateHighlight()
        })
      }, 16) // ~60fps update rate
    }

    // Listen to scroll on window and all scrollable containers
    window.addEventListener('scroll', handleUpdate, { passive: true, capture: true })
    window.addEventListener('resize', handleUpdate, { passive: true })

    // Also listen to scroll on scrollable containers
    const scrollableElements = document.querySelectorAll('[class*="overflow"], [class*="scroll"]')
    scrollableElements.forEach(el => {
      el.addEventListener('scroll', handleUpdate, { passive: true, capture: true })
    })

    return () => {
      window.removeEventListener('scroll', handleUpdate, { capture: true })
      window.removeEventListener('resize', handleUpdate)
      scrollableElements.forEach(el => {
        el.removeEventListener('scroll', handleUpdate, { capture: true })
      })
      clearTimeout(timeoutId)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isActive, currentStep, steps, updateHighlight])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      tourService.setCurrentStep(tourName, nextStep)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      tourService.setCurrentStep(tourName, prevStep)
    }
  }

  const handleSkip = () => {
    setIsActive(false)
    tourService.completeTour(tourName)
    tourService.resetCurrentStep(tourName)
    if (onSkip) onSkip()
  }

  if (!isActive || steps.length === 0 || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const stepPosition = highlightPosition

  return (
    <>
      {/* Overlay - lighter so user can still see content */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/20 transition-opacity pointer-events-none"
      />

      {/* Highlight - with cutout for the element */}
      {stepPosition && (
        <>
          {/* Top overlay */}
          <div
            className="fixed z-[9999] bg-black/20 pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: `${stepPosition.top}px`
            }}
          />
          {/* Bottom overlay */}
          <div
            className="fixed z-[9999] bg-black/20 pointer-events-none"
            style={{
              top: `${stepPosition.top + stepPosition.height}px`,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
          {/* Left overlay */}
          <div
            className="fixed z-[9999] bg-black/20 pointer-events-none"
            style={{
              top: `${stepPosition.top}px`,
              left: 0,
              width: `${stepPosition.left}px`,
              height: `${stepPosition.height}px`
            }}
          />
          {/* Right overlay */}
          <div
            className="fixed z-[9999] bg-black/20 pointer-events-none"
            style={{
              top: `${stepPosition.top}px`,
              left: `${stepPosition.left + stepPosition.width}px`,
              right: 0,
              height: `${stepPosition.height}px`
            }}
          />
          {/* Highlight border - allows interaction with element */}
          <div
            className="fixed z-[10001] border-4 border-blue-500 rounded-lg pointer-events-none transition-all"
            style={{
              top: `${stepPosition.top}px`,
              left: `${stepPosition.left}px`,
              width: `${stepPosition.width}px`,
              height: `${stepPosition.height}px`,
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
            }}
          />
          {/* Invisible overlay to allow clicks on highlighted element */}
          <div
            className="fixed z-[9997] pointer-events-auto"
            style={{
              top: `${stepPosition.top}px`,
              left: `${stepPosition.left}px`,
              width: `${stepPosition.width}px`,
              height: `${stepPosition.height}px`
            }}
            onClick={(e) => {
              // Allow clicks to pass through to the element
              e.stopPropagation()
            }}
          />
        </>
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] bg-white rounded-2xl shadow-2xl p-6 max-w-sm animate-pop-in pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: tooltipPosition.transform,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Bot Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-1">Hướng dẫn</h3>
            <p className="text-sm text-gray-600">{step.content}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-500">
            Bước {currentStep + 1} / {steps.length}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              ← Trước
            </button>
          )}
          {showSkip && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Bỏ qua
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium text-sm"
          >
            {currentStep === steps.length - 1 ? 'Hoàn thành ✓' : 'Tiếp theo →'}
          </button>
        </div>
      </div>
    </>
  )
}

export default TourGuide

