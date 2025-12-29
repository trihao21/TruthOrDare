// Identity/Player management service
// Manages sealed accounts with random assignment (Backend + LocalStorage)

import { api } from './api.js'

const IDENTITIES = [
  { id: 'player_1', avatar: '🔵', color: '#3B82F6', displayName: 'Người chơi 1' },
  { id: 'player_2', avatar: '🟣', color: '#8B5CF6', displayName: 'Người chơi 2' },
  { id: 'player_3', avatar: '🟢', color: '#10B981', displayName: 'Người chơi 3' },
  { id: 'player_4', avatar: '🟡', color: '#F59E0B', displayName: 'Người chơi 4' },
  { id: 'player_5', avatar: '🔴', color: '#EF4444', displayName: 'Người chơi 5' },
  { id: 'player_6', avatar: '🟠', color: '#F97316', displayName: 'Người chơi 6' },
  { id: 'player_7', avatar: '🟤', color: '#A16207', displayName: 'Người chơi 7' },
  { id: 'player_8', avatar: '⚪', color: '#6B7280', displayName: 'Người chơi 8' }
]

const STORAGE_KEY = 'hipdam_assigned_identity'
const STORAGE_KEY_LOGOUT_FLAG = 'hipdam_manual_logout'
const STORAGE_KEY_DEVICE_ID = 'hipdam_device_id'

// Generate or get unique device ID
const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem(STORAGE_KEY_DEVICE_ID)
  if (!deviceId) {
    // Generate unique device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${navigator.userAgent.substring(0, 20).replace(/\s/g, '_')}`
    localStorage.setItem(STORAGE_KEY_DEVICE_ID, deviceId)
  }
  return deviceId
}

export const identityService = {
  // Get all available identities
  getAllIdentities() {
    return IDENTITIES
  },

  // Get currently assigned identity for this device
  getAssignedIdentity() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return null
      }
    }
    return null
  },

  // Check if device already has an identity assigned
  hasIdentity() {
    return this.getAssignedIdentity() !== null
  },

  // Draw a random identity from backend
  async drawRandomIdentity(username) {
    try {
      // Call backend API to assign identity
      const response = await api.assignIdentity(username)
      
      if (response.success && response.identity) {
        // Save to localStorage as cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.identity))
        
        // Save account info if provided
        if (response.account) {
          localStorage.setItem('hipdam_account_info', JSON.stringify(response.account))
        }
        
        return {
          identity: response.identity,
          account: response.account
        }
      }
      
      throw new Error('Failed to assign identity')
    } catch (error) {
      console.error('Error drawing identity from backend:', error)
      // Fallback to local if backend fails
      const localIdentity = this.drawRandomIdentityLocal()
      return {
        identity: localIdentity,
        account: null
      }
    }
  },
  
  // Get account info from localStorage
  getAccountInfo() {
    try {
      const accountInfo = localStorage.getItem('hipdam_account_info')
      return accountInfo ? JSON.parse(accountInfo) : null
    } catch {
      return null
    }
  },

  // Fallback: Draw random identity locally (if backend unavailable)
  drawRandomIdentityLocal() {
    const existing = this.getAssignedIdentity()
    if (existing) {
      return existing
    }

    // Random select from all identities
    const randomIndex = Math.floor(Math.random() * IDENTITIES.length)
    const selected = IDENTITIES[randomIndex]

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected))
    return selected
  },

  // Reset identity (for testing)
  resetIdentity() {
    localStorage.removeItem(STORAGE_KEY)
    // Note: We don't remove from taken list to prevent immediate re-assignment
  },

  // Clear all identity data (for testing)
  clearAll() {
    localStorage.removeItem(STORAGE_KEY)
  },

  // Get current identity info
  getCurrentIdentity() {
    return this.getAssignedIdentity()
  },

  // Convert identity ID to username (player_1 -> player1)
  getIdToUsername(identityId) {
    // Convert player_1 -> player1, player_2 -> player2, etc.
    return identityId.replace('_', '')
  },

  // Get username from identity
  getUsernameFromIdentity(identity) {
    if (!identity) return null
    return this.getIdToUsername(identity.id)
  },

  // Mark that user has manually logged out (don't auto-login)
  setManualLogout() {
    localStorage.setItem(STORAGE_KEY_LOGOUT_FLAG, 'true')
  },

  // Check if user has manually logged out
  hasManualLogout() {
    return localStorage.getItem(STORAGE_KEY_LOGOUT_FLAG) === 'true'
  },

  // Clear manual logout flag (when user manually logs in again)
  clearManualLogout() {
    localStorage.removeItem(STORAGE_KEY_LOGOUT_FLAG)
  },

  // Get status of all identities from backend
  async getAllIdentitiesStatus() {
    try {
      const response = await api.getIdentitiesStatus()
      if (response.success && response.identities) {
        return response.identities
      }
      throw new Error('Failed to get identities status')
    } catch (error) {
      console.error('Error getting identities status from backend:', error)
      // Fallback to local status
      return this.getAllIdentitiesStatusLocal()
    }
  },

  // Fallback: Get status locally
  getAllIdentitiesStatusLocal() {
    const current = this.getAssignedIdentity()
    return IDENTITIES.map(identity => ({
      ...identity,
      isTaken: false, // Can't know from local only
      isCurrent: current && current.id === identity.id
    }))
  },

  // Get current identity from backend (by deviceId)
  async getCurrentIdentityFromBackend() {
    try {
      const response = await api.getCurrentIdentity()
      if (response.success) {
        if (response.identity) {
          // Cache in localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.identity))
          
          // Save account info if provided
          if (response.account) {
            localStorage.setItem('hipdam_account_info', JSON.stringify(response.account))
          }
          
          return response.identity
        }
        return null
      }
    } catch (error) {
      console.error('Error getting current identity from backend:', error)
      // Fallback to local
      return this.getAssignedIdentity()
    }
  },

  // Get identity assignment by username
  // USE CASE: User đã bốc thăm ở thiết bị A, bây giờ đăng nhập ở thiết bị B
  // Method này lấy identity từ backend dựa trên username (không phải deviceId)
  // Backend sẽ tự động update deviceId để thiết bị B cũng có identity này
  // Sau đó lưu identity và account info vào localStorage của thiết bị B
  async getIdentityByUsername(username) {
    try {
      const response = await api.getIdentityByUsername(username)
      if (response.success) {
        if (response.identity) {
          // Lưu identity vào localStorage của thiết bị hiện tại
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.identity))
          
          // Lưu account info (username, password) vào localStorage
          // Điều này cho phép app sử dụng thông tin đăng nhập sau này
          if (response.account) {
            localStorage.setItem('hipdam_account_info', JSON.stringify(response.account))
          }
          
          console.log(`Identity synced for username ${username} on new device`)
          return response.identity
        }
        // Không tìm thấy identity assignment
        return null
      }
    } catch (error) {
      console.error('Error getting identity by username from backend:', error)
      return null
    }
  }
}

