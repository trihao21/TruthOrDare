import { utilService } from './utilService'

const STORAGE_KEY = 'submitted_questions'

export const submittedQuestionsService = {
  // Get all submitted questions
  getAll() {
    return utilService.storage.get(STORAGE_KEY, [])
  },

  // Add submitted questions
  add(questions) {
    const existing = this.getAll()
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      questions: questions.map(q => ({
        category: q.category,
        content: q.content,
        submittedAt: new Date().toISOString()
      }))
    }
    existing.unshift(newEntry) // Add to beginning
    utilService.storage.set(STORAGE_KEY, existing)
    return newEntry
  },

  // Clear all submitted questions
  clear() {
    utilService.storage.remove(STORAGE_KEY)
  },

  // Remove a specific submission
  remove(id) {
    const existing = this.getAll()
    const filtered = existing.filter(entry => entry.id !== id)
    utilService.storage.set(STORAGE_KEY, filtered)
  }
}

