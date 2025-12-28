import { utilService } from './utilService'

const IDENTITIES_KEY = 'sealed_identities'
const ASSIGNMENTS_KEY = 'identity_assignments'
const DEVICE_ID_KEY = 'device_id'

// 8 identity cố định
const DEFAULT_IDENTITIES = [
  { id: 'player_1', avatar: '🔵', color: 'blue', colorName: 'Xanh dương' },
  { id: 'player_2', avatar: '🟣', color: 'purple', colorName: 'Tím' },
  { id: 'player_3', avatar: '🟢', color: 'green', colorName: 'Xanh lá' },
  { id: 'player_4', avatar: '🔴', color: 'red', colorName: 'Đỏ' },
  { id: 'player_5', avatar: '🟠', color: 'orange', colorName: 'Cam' },
  { id: 'player_6', avatar: '🟡', color: 'yellow', colorName: 'Vàng' },
  { id: 'player_7', avatar: '⚫', color: 'black', colorName: 'Đen' },
  { id: 'player_8', avatar: '⚪', color: 'white', colorName: 'Trắng' }
]

// Tạo device ID duy nhất cho thiết bị
const getDeviceId = () => {
  let deviceId = utilService.storage.get(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    utilService.storage.set(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

export const identityService = {
  // Khởi tạo 8 identity (chỉ làm 1 lần)
  initialize() {
    const existing = utilService.storage.get(IDENTITIES_KEY)
    if (!existing || existing.length === 0) {
      utilService.storage.set(IDENTITIES_KEY, DEFAULT_IDENTITIES)
    }
  },

  // Lấy tất cả identities
  getAllIdentities() {
    this.initialize()
    return utilService.storage.get(IDENTITIES_KEY, DEFAULT_IDENTITIES)
  },

  // Lấy tất cả assignments (device -> identity)
  getAllAssignments() {
    return utilService.storage.get(ASSIGNMENTS_KEY, {})
  },

  // Lấy identity đã được assign cho device hiện tại
  getMyIdentity() {
    const deviceId = getDeviceId()
    const assignments = this.getAllAssignments()
    const myIdentityId = assignments[deviceId]
    
    if (!myIdentityId) {
      return null
    }

    const identities = this.getAllIdentities()
    return identities.find(id => id.id === myIdentityId) || null
  },

  // Lấy danh sách identity đã được bốc
  getAssignedIdentities() {
    const assignments = this.getAllAssignments()
    return Object.values(assignments)
  },

  // Lấy danh sách identity chưa được bốc
  getAvailableIdentities() {
    const allIdentities = this.getAllIdentities()
    const assignedIds = this.getAssignedIdentities()
    return allIdentities.filter(id => !assignedIds.includes(id.id))
  },

  // Bốc thăm ngẫu nhiên một identity
  drawRandomIdentity() {
    // Kiểm tra xem device đã bốc chưa
    const myIdentity = this.getMyIdentity()
    if (myIdentity) {
      return { success: false, error: 'Bạn đã bốc thăm rồi!', identity: myIdentity }
    }

    // Lấy danh sách identity còn trống
    const available = this.getAvailableIdentities()
    
    if (available.length === 0) {
      return { success: false, error: 'Tất cả identity đã được bốc hết!' }
    }

    // Random một identity
    const randomIndex = Math.floor(Math.random() * available.length)
    const selectedIdentity = available[randomIndex]

    // Gán cho device hiện tại
    const deviceId = getDeviceId()
    const assignments = this.getAllAssignments()
    assignments[deviceId] = selectedIdentity.id
    utilService.storage.set(ASSIGNMENTS_KEY, assignments)

    return { success: true, identity: selectedIdentity }
  },

  // Reset tất cả (chỉ dùng cho testing/admin)
  resetAll() {
    utilService.storage.remove(ASSIGNMENTS_KEY)
    utilService.storage.remove(DEVICE_ID_KEY)
    this.initialize()
  },

  // Reset identity của device hiện tại
  resetMyIdentity() {
    const deviceId = getDeviceId()
    const assignments = this.getAllAssignments()
    delete assignments[deviceId]
    utilService.storage.set(ASSIGNMENTS_KEY, assignments)
  },

  // Lấy device ID
  getDeviceId() {
    return getDeviceId()
  }
}

