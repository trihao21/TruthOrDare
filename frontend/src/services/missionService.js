import { api } from './api.js'

export const missionService = {
  // Get all missions
  async getMissions() {
    return api.get('/missions')
  },

  // Get mission by ID
  async getMissionById(id) {
    return api.get(`/missions/${id}`)
  },

  // Submit mission with image
  async submitMission(missionId, userId, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('missionId', missionId)
    formData.append('userId', userId)

    const token = api.getToken()
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/missions/${missionId}/submit`, {
      method: 'POST',
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {},
      body: formData
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to submit mission' }))
      throw new Error(error.error || 'Failed to submit mission')
    }

    return response.json()
  },

  // Get submissions for a mission
  async getMissionSubmissions(missionId) {
    return api.get(`/missions/${missionId}/submissions`)
  },

  // Get user's submissions
  async getUserSubmissions(userId) {
    return api.get(`/missions/user/${userId}/submissions`)
  },

  // Notify mission unlock via email
  async notifyMissionUnlock(missionId, userEmail) {
    return api.post('/missions/notify-unlock', {
      missionId,
      userEmail
    })
  }
}


