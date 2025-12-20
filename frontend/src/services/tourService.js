import { utilService } from './utilService'

const TOUR_STORAGE_KEY = 'hipdam_tour_completed'
const TOUR_STEP_KEY = 'hipdam_tour_current_step'

export const tourService = {
  // Check if tour is completed
  isTourCompleted(tourName) {
    const completed = utilService.storage.get(TOUR_STORAGE_KEY, {})
    return completed[tourName] === true
  },

  // Mark tour as completed
  completeTour(tourName) {
    const completed = utilService.storage.get(TOUR_STORAGE_KEY, {})
    completed[tourName] = true
    utilService.storage.set(TOUR_STORAGE_KEY, completed)
  },

  // Reset tour (for testing or restart)
  resetTour(tourName) {
    const completed = utilService.storage.get(TOUR_STORAGE_KEY, {})
    delete completed[tourName]
    utilService.storage.set(TOUR_STORAGE_KEY, completed)
    this.resetCurrentStep(tourName)
  },

  // Get current step
  getCurrentStep(tourName) {
    const steps = utilService.storage.get(TOUR_STEP_KEY, {})
    return steps[tourName] || 0
  },

  // Set current step
  setCurrentStep(tourName, step) {
    const steps = utilService.storage.get(TOUR_STEP_KEY, {})
    steps[tourName] = step
    utilService.storage.set(TOUR_STEP_KEY, steps)
  },

  // Reset current step
  resetCurrentStep(tourName) {
    const steps = utilService.storage.get(TOUR_STEP_KEY, {})
    delete steps[tourName]
    utilService.storage.set(TOUR_STEP_KEY, steps)
  },

  // Reset all tours
  resetAllTours() {
    utilService.storage.remove(TOUR_STORAGE_KEY)
    utilService.storage.remove(TOUR_STEP_KEY)
  }
}


