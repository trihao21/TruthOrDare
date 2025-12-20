import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { missionAuthService } from '../services/missionAuthService'
import { missionService } from '../services/missionService'
import MissionUnlockModal from '../components/MissionUnlockModal'

function MissionPage() {
  const navigate = useNavigate()
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState({})
  const [selectedMission, setSelectedMission] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState({})
  const [error, setError] = useState('')
  const [unlockedMission, setUnlockedMission] = useState(null)
  const [unlockingMissions, setUnlockingMissions] = useState(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const previousStatusesRef = useRef({})

  const currentUser = missionAuthService.getCurrentUser()

  // Update time remaining every second and check for unlocks
  useEffect(() => {
    const interval = setInterval(() => {
      const times = {}
      missions.forEach(mission => {
        if (mission.endTime) {
          times[mission._id] = getTimeRemaining(mission.endTime)
        }
      })
      setTimeRemaining(times)
      
      // Check for status changes that might trigger unlock
      // This ensures we catch unlocks even if they happen between renders
      if (!isInitialLoad && missions.length > 0) {
        missions.forEach(mission => {
          const missionId = mission._id
          const currentStatus = getMissionStatus(mission)
          const previousStatus = previousStatusesRef.current[missionId]

          // If mission just unlocked (pending -> active)
          if (previousStatus === 'pending' && currentStatus === 'active') {
            console.log('Mission unlocked via timer:', mission.name, missionId)
            setUnlockingMissions(prev => new Set([...prev, missionId]))
            
            // Send email notification if user is logged in
            if (currentUser?.email) {
              missionService.notifyMissionUnlock(missionId, currentUser.email)
                .then(result => {
                  console.log('Unlock notification email sent:', result)
                })
                .catch(error => {
                  console.error('Failed to send unlock notification email:', error)
                })
            }
            
            setTimeout(() => {
              setUnlockedMission(mission)
              setUnlockingMissions(prev => {
                const newSet = new Set(prev)
                newSet.delete(missionId)
                return newSet
              })
            }, 800)
          }

          // Update previous status
          previousStatusesRef.current[missionId] = currentStatus
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [missions, isInitialLoad])

  useEffect(() => {
    loadMissions()
  }, [])

  useEffect(() => {
    if (missions.length > 0) {
      loadSubmissions()
    }
  }, [missions])

  // Initialize previous statuses on first load (don't trigger unlock on initial load)
  useEffect(() => {
    if (missions.length > 0 && isInitialLoad) {
      missions.forEach(mission => {
        const missionId = mission._id
        const currentStatus = getMissionStatus(mission)
        previousStatusesRef.current[missionId] = currentStatus
      })
      setIsInitialLoad(false)
    }
  }, [missions, isInitialLoad])

  // Detect mission unlocks (pending -> active) - only after initial load
  useEffect(() => {
    if (missions.length === 0 || isInitialLoad) return

    missions.forEach(mission => {
      const missionId = mission._id
      const currentStatus = getMissionStatus(mission)
      const previousStatus = previousStatusesRef.current[missionId]

      // If mission just unlocked (pending -> active)
      if (previousStatus === 'pending' && currentStatus === 'active') {
        console.log('Mission unlocked:', mission.name, missionId)
        setUnlockingMissions(prev => new Set([...prev, missionId]))
        
        // Send email notification if user is logged in
        if (currentUser?.email) {
          missionService.notifyMissionUnlock(missionId, currentUser.email)
            .then(result => {
              console.log('Unlock notification email sent:', result)
            })
            .catch(error => {
              console.error('Failed to send unlock notification email:', error)
            })
        }
        
        // Show unlock animation, then show modal
        setTimeout(() => {
          setUnlockedMission(mission)
          setUnlockingMissions(prev => {
            const newSet = new Set(prev)
            newSet.delete(missionId)
            return newSet
          })
        }, 800) // Wait for unlock animation to complete
      }

      // Update previous status
      previousStatusesRef.current[missionId] = currentStatus
    })
  }, [missions, submissions, isInitialLoad])

  const loadMissions = async () => {
    try {
      setError('')
      console.log('Loading missions...')
      const response = await missionService.getMissions()
      console.log('Missions response:', response)
      setMissions(response.missions || [])
      if (!response.missions || response.missions.length === 0) {
        setError('Chưa có nhiệm vụ nào. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Failed to load missions:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      setError(`Không thể tải danh sách nhiệm vụ: ${error.message}. Vui lòng kiểm tra kết nối và thử lại.`)
      setMissions([])
    } finally {
      setLoading(false)
    }
  }

  const loadSubmissions = async () => {
    const submissionsData = {}
    for (const mission of missions) {
      try {
        const response = await missionService.getMissionSubmissions(mission._id)
        submissionsData[mission._id] = response.submissions || []
      } catch (error) {
        submissionsData[mission._id] = []
      }
    }
    setSubmissions(submissionsData)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      setPreviewImage(URL.createObjectURL(file))
      setUploadError('')
    }
  }

  const handleSubmit = async (mission) => {
    const fileInput = document.getElementById(`image-${mission._id}`)
    const file = fileInput?.files[0]

    if (!file) {
      setUploadError('Vui lòng chọn ảnh để upload')
      return
    }

    try {
      setUploading(true)
      setUploadError('')
      
      await missionService.submitMission(mission._id, currentUser.email, file)
      
      // Reload submissions
      await loadSubmissions()
      setSelectedMission(null)
      setPreviewImage(null)
      fileInput.value = ''
    } catch (error) {
      setUploadError(error.message || 'Upload thất bại')
    } finally {
      setUploading(false)
    }
  }

  const getMissionStatus = (mission) => {
    const now = new Date()
    const startTime = new Date(mission.startTime)
    const endTime = new Date(mission.endTime)
    const missionSubmissions = submissions[mission._id] || []
    const userSubmitted = missionSubmissions.some(s => s.userId === currentUser?.email)

    if (now < startTime) return 'pending'
    if (now > endTime) return 'expired'
    if (userSubmitted) return 'completed'
    return 'active'
  }

  const getTimeRemaining = (endTime) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end - now

    if (diff <= 0) return { expired: true }

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    return {
      expired: false,
      minutes,
      seconds,
      totalSeconds: Math.floor(diff / 1000)
    }
  }

  // Check if user is authenticated for mission
  const isAuthenticated = missionAuthService.isAuthenticated()

  if (!isAuthenticated) {
    // Redirect to mission login if not authenticated
    navigate('/mission-login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D4CEFF] to-[#A1CDED] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] mb-2">
            Nhiệm Vụ Bí Mật
          </h1>
          <p className="text-gray-600">
            Hoàn thành các nhiệm vụ để nhận phần thưởng đặc biệt
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">📸</div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-800 mb-2 text-lg">
                Hướng dẫn Check-in
              </h3>
              <p className="text-yellow-700 text-sm leading-relaxed mb-2">
                Khi đến địa điểm và đủ thành viên, hãy chụp ảnh để check-in. 
                Người chụp cuối cùng hoặc chụp sau thời gian quy định sẽ bị phạt! ⚠️
              </p>
              <p className="text-yellow-600 text-xs">
                ⏰ Thời gian phạt: 5 phút trước khi hết hạn
              </p>
            </div>
          </div>
        </div>

        {/* Test Unlock Button (for development) */}
        <div className="mb-4 text-center">
          <button
            onClick={() => {
              // Try to find active or pending mission first
              let testMission = missions.find(m => {
                const status = getMissionStatus(m)
                return status === 'active' || status === 'pending'
              })
              
              // If not found, use the first mission available (for testing purposes)
              if (!testMission && missions.length > 0) {
                testMission = missions[0]
                console.log('No active/pending mission found, using first mission for testing:', testMission.name)
              }
              
              if (testMission) {
                // Simulate unlock by temporarily setting previous status to pending
                previousStatusesRef.current[testMission._id] = 'pending'
                // Force status to active for testing
                const missionId = testMission._id
                console.log('Testing unlock for mission:', testMission.name)
                setUnlockingMissions(prev => new Set([...prev, missionId]))
                setTimeout(() => {
                  setUnlockedMission(testMission)
                  setUnlockingMissions(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(missionId)
                    return newSet
                  })
                  // Reset previous status
                  previousStatusesRef.current[missionId] = 'active'
                }, 800)
              } else {
                alert('Không tìm thấy nhiệm vụ để test. Vui lòng đảm bảo có ít nhất một nhiệm vụ trong hệ thống.')
              }
            }}
            disabled={loading || missions.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-lg hover:opacity-90 transition-all text-sm font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎬 Test Unlock Animation
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Đang tải nhiệm vụ...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadMissions}
              className="px-6 py-2 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : missions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-600">Chưa có nhiệm vụ nào</p>
            <button
              onClick={loadMissions}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Tải lại
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map((mission, index) => {
              const status = getMissionStatus(mission)
              const missionSubmissions = submissions[mission._id] || []
              const userSubmitted = missionSubmissions.some(s => s.userId === currentUser?.email)
              const missionTimeRemaining = timeRemaining[mission._id] || getTimeRemaining(mission.endTime)
              const isActive = status === 'active'
              const isExpired = status === 'expired'
              const isPending = status === 'pending'
              const isCompleted = status === 'completed'

              const isUnlocking = unlockingMissions.has(mission._id)
              
              return (
                <div
                  key={mission._id}
                  className={`relative bg-gradient-to-r from-[#D4CEFF]/30 to-[#A1CDED]/30 rounded-2xl p-6 border-2 transition-all transform ${
                    isPending || isExpired
                      ? 'border-gray-300 opacity-60'
                      : isActive
                      ? 'border-green-400 shadow-lg scale-100'
                      : 'border-[#D4CEFF]'
                  } ${isUnlocking ? 'mission-unlocking' : ''} hover:scale-[1.02]`}
                >
                  {/* Status Overlay with Lock */}
                  {isPending && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className={`text-5xl mb-2 ${isUnlocking ? 'lock-breaking' : ''}`}>
                          {isUnlocking ? '🔓' : '🔒'}
                        </div>
                        <p className="text-gray-600 font-semibold">
                          {isUnlocking ? 'Đang mở khóa...' : 'Chưa bắt đầu'}
                        </p>
                        {isUnlocking && (
                          <div className="mt-2 flex justify-center gap-1">
                            <div className="w-2 h-2 bg-[#D4CEFF] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#A1CDED] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#D4CEFF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {isExpired && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="text-5xl mb-2">⏰</div>
                        <p className="text-gray-600 font-semibold">Đã hết hạn</p>
                      </div>
                    </div>
                  )}

                  <div className="relative z-0">
                    {/* Mission Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300 ${
                        isPending || isExpired
                          ? 'bg-gray-300 text-gray-600'
                          : isActive
                          ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                          : 'bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white shadow-lg'
                      } ${isActive ? 'animate-pulse' : ''}`}>
                        {index + 1}
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className={`text-2xl font-black transition-colors ${
                          isPending || isExpired ? 'text-gray-500' : 'text-gray-800'
                        }`}>
                          {mission.name === 'Đi ăn' ? '🍽️ ' : mission.name === 'Đi chụp photobooth' ? '📸 ' : '🍺 '}
                          {mission.name}
                        </h2>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <span>📍</span>
                          <span>{mission.location}</span>
                        </p>
                      </div>
                      {isCompleted && (
                        <div className="text-4xl animate-bounce-in">✅</div>
                      )}
                      {isActive && !isCompleted && (
                        <div className="relative">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Time and Status Info */}
                    {isActive && (
                      <div className="bg-gradient-to-r from-[#A1CDED]/30 to-[#D4CEFF]/30 border-2 border-[#A1CDED] rounded-xl p-4 mb-4 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
                              <span>⏱️</span>
                              <span>Thời gian còn lại</span>
                            </p>
                            {missionTimeRemaining.expired ? (
                              <p className="text-red-600 font-bold text-xl">Đã hết hạn</p>
                            ) : (
                              <p className="text-blue-800 font-black text-2xl font-mono">
                                {String(missionTimeRemaining.minutes || 0).padStart(2, '0')}:{String(missionTimeRemaining.seconds || 0).padStart(2, '0')}
                              </p>
                            )}
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center justify-end gap-1">
                              <span>👥</span>
                              <span>Đã check-in</span>
                            </p>
                            <p className="text-blue-800 font-black text-2xl">
                              {missionSubmissions.length} / {mission.requiredMembers}
                            </p>
                          </div>
                        </div>
                        {missionTimeRemaining.totalSeconds && missionTimeRemaining.totalSeconds <= mission.penaltyTime && !missionTimeRemaining.expired && (
                          <div className="mt-3 bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-400 rounded-lg p-3 animate-pulse">
                            <p className="text-sm text-red-700 font-bold flex items-center gap-2">
                              <span className="text-lg">⚠️</span>
                              <span>Thời gian phạt đã bắt đầu!</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload Section */}
                    {isActive && !userSubmitted && (
                      <div className="mb-4">
                        {selectedMission === mission._id ? (
                          <div className="space-y-4">
                            {/* Image Preview */}
                            {previewImage && (
                              <div className="relative">
                                <img
                                  src={previewImage}
                                  alt="Preview"
                                  className="w-full h-64 object-cover rounded-lg border-2 border-[#D4CEFF]"
                                />
                                <button
                                  onClick={() => {
                                    setPreviewImage(null)
                                    document.getElementById(`image-${mission._id}`).value = ''
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                >
                                  ✕
                                </button>
                              </div>
                            )}

                            {/* File Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn ảnh để check-in
                              </label>
                              <input
                                id={`image-${mission._id}`}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4CEFF]"
                                disabled={uploading}
                              />
                              <p className="text-xs text-gray-500 mt-1">Tối đa 5MB</p>
                            </div>

                            {uploadError && (
                              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {uploadError}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedMission(null)
                                  setPreviewImage(null)
                                  setUploadError('')
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                disabled={uploading}
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => handleSubmit(mission)}
                                disabled={uploading || !previewImage}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {uploading ? 'Đang upload...' : 'Xác nhận check-in'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedMission(mission._id)}
                            className="w-full py-4 px-6 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 relative overflow-hidden group"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <span className="text-2xl">📸</span>
                              <span>Chụp ảnh check-in</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4CEFF] to-[#A1CDED] opacity-80 group-hover:opacity-100 transition-opacity"></div>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Completed Status */}
                    {isCompleted && (
                      <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">✅</span>
                          <div>
                            <p className="text-green-800 font-semibold">Đã check-in thành công!</p>
                            <p className="text-green-600 text-sm">Ảnh của bạn đã được gửi</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submissions List */}
                    {missionSubmissions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Thành viên đã check-in:</p>
                        <div className="flex flex-wrap gap-2">
                          {missionSubmissions.map((submission, idx) => (
                            <div
                              key={idx}
                              className={`relative group ${
                                submission.isPenalty ? 'ring-2 ring-red-400' : ''
                              }`}
                            >
                              <img
                                src={submission.imageUrl}
                                alt={`Check-in ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-[#D4CEFF]"
                              />
                              {submission.isPenalty && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                  ⚠️
                                </div>
                              )}
                              {submission.isPenalty && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                  {submission.penaltyReason === 'last_submission' ? 'Chụp cuối cùng' : 'Chụp muộn'}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>

      {/* Unlock Modal */}
      {unlockedMission && (
        <MissionUnlockModal
          mission={unlockedMission}
          onClose={() => setUnlockedMission(null)}
        />
      )}
    </div>
  )
}

export default MissionPage

