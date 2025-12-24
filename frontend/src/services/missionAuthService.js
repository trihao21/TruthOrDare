// Mission authentication service - separate from main Hipdam auth
// This is a simplified auth for mission system that doesn't require backend validation

const MISSION_AUTH_KEY = 'mission_auth_token'
const MISSION_USER_KEY = 'mission_user'

export const missionAuthService = {
  // Login with email (both username and password are email)
  async login(email) {
    try {
      // Simple validation - just check if it's a valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Email không hợp lệ' }
      }

      // Store mission auth (no backend validation needed)
      const token = `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const user = {
        email: email,
        type: 'mission'
      }

      localStorage.setItem(MISSION_AUTH_KEY, token)
      localStorage.setItem(MISSION_USER_KEY, JSON.stringify(user))

      return { success: true, user, token }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(MISSION_AUTH_KEY)
    localStorage.removeItem(MISSION_USER_KEY)
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(MISSION_AUTH_KEY)
    return !!token
  },

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(MISSION_USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  // Get token
  getToken() {
    return localStorage.getItem(MISSION_AUTH_KEY)
  }
}







