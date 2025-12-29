import IdentityAssignment from '../models/IdentityAssignment.js';
import User from '../models/User.js';

const IDENTITIES = [
  { id: 'player_1', avatar: '🔵', color: '#3B82F6', displayName: 'Người chơi 1' },
  { id: 'player_2', avatar: '🟣', color: '#8B5CF6', displayName: 'Người chơi 2' },
  { id: 'player_3', avatar: '🟢', color: '#10B981', displayName: 'Người chơi 3' },
  { id: 'player_4', avatar: '🟡', color: '#F59E0B', displayName: 'Người chơi 4' },
  { id: 'player_5', avatar: '🔴', color: '#EF4444', displayName: 'Người chơi 5' },
  { id: 'player_6', avatar: '🟠', color: '#F97316', displayName: 'Người chơi 6' },
  { id: 'player_7', avatar: '🟤', color: '#A16207', displayName: 'Người chơi 7' },
  { id: 'player_8', avatar: '⚪', color: '#6B7280', displayName: 'Người chơi 8' }
];

// Generate device ID from request
const getDeviceId = (req) => {
  // Prefer device ID from header (sent by frontend)
  const headerDeviceId = req.get('x-device-id');
  if (headerDeviceId) {
    return headerDeviceId;
  }
  
  // Fallback: Use IP + User-Agent as device identifier
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';
  // Simple hash (for demo, in production use proper hashing)
  return Buffer.from(`${ip}-${userAgent}`).toString('base64').substring(0, 32);
};

// Assign random identity
export const assignIdentity = async (req, res) => {
  try {
    const deviceId = getDeviceId(req);
    const { username } = req.body;

    // Username is optional, can be updated later after login

    // Check if device already has an identity
    const existing = await IdentityAssignment.findOne({ deviceId });
    if (existing) {
      const identity = IDENTITIES.find(id => id.id === existing.identityId);
      return res.json({
        success: true,
        identity: {
          ...identity,
          isNew: false
        },
        account: {
          username: existing.username,
          password: existing.password || '123456' // Fallback to default if password not set
        }
      });
    }

    // Get all assigned identities
    const assigned = await IdentityAssignment.find({});
    const takenIds = assigned.map(a => a.identityId);

    // Get available identities
    const available = IDENTITIES.filter(id => !takenIds.includes(id.id));

    if (available.length === 0) {
      return res.status(400).json({ error: 'Tất cả identity đã được chọn' });
    }

    // Random select from available
    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];

    // Generate username from identity (e.g., player_1 -> player1)
    const generatedUsername = selected.id.replace('_', '');
    
    // Generate random password (8-12 characters, alphanumeric + special chars)
    const generatePassword = () => {
      const length = 8 + Math.floor(Math.random() * 5); // 8-12 characters
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };
    
    // Check if assignment already exists for this identity
    let existingAssignment = await IdentityAssignment.findOne({ identityId: selected.id });
    let passwordToUse = null;
    
    // Check if user account already exists
    let userAccount = await User.findOne({ username: generatedUsername });
    
    if (existingAssignment && existingAssignment.password) {
      // Identity already assigned - use existing password (password never changes)
      passwordToUse = existingAssignment.password;
      
      // Update deviceId if different (same identity, different device)
      existingAssignment.deviceId = deviceId;
      await existingAssignment.save();
    } else if (!userAccount) {
      // New user - generate password only once
      const generatedPassword = generatePassword();
      passwordToUse = generatedPassword;
      
      // Create user account with generated password
      userAccount = new User({
        username: generatedUsername,
        email: `${generatedUsername}@truthordare.local`, // Temporary email
        password: generatedPassword, // Will be hashed by UserSchema pre-save hook
        displayName: selected.displayName,
        role: 'user'
      });
      await userAccount.save();
      
      // Create new assignment with password
      existingAssignment = new IdentityAssignment({
        identityId: selected.id,
        deviceId,
        username: generatedUsername,
        password: generatedPassword // Store plain password for display (in production, consider encryption)
      });
      await existingAssignment.save();
    } else {
      // User exists but no assignment - this shouldn't happen in normal flow
      // But if it does, we can't retrieve the original password (it's hashed)
      // So we'll need to generate a new one and update the user
      // However, user said password should not change, so this is an edge case
      // For now, we'll use a fallback or throw an error
      return res.status(500).json({ 
        error: 'User account exists but no identity assignment found. Please contact administrator.' 
      });
    }

    res.json({
      success: true,
      identity: {
        ...selected,
        isNew: !existingAssignment || existingAssignment.deviceId !== deviceId
      },
      account: {
        username: generatedUsername,
        password: passwordToUse
      }
    });
  } catch (error) {
    console.error('Assign identity error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get status of all identities
export const getIdentitiesStatus = async (req, res) => {
  try {
    const deviceId = getDeviceId(req);
    
    // Get all assignments
    const assignments = await IdentityAssignment.find({});
    const takenIds = assignments.map(a => a.identityId);
    
    
    // Get current device's identity
    const currentAssignment = await IdentityAssignment.findOne({ deviceId });
    const currentId = currentAssignment ? currentAssignment.identityId : null;

    // Map all identities with status
    const status = IDENTITIES.map(identity => ({
      ...identity,
      isTaken: takenIds.includes(identity.id),
      isCurrent: identity.id === currentId
    }));

    res.json({
      success: true,
      identities: status,
      currentIdentity: currentId
    });
  } catch (error) {
    console.error('Get identities status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current identity for device
export const getCurrentIdentity = async (req, res) => {
  try {
    const deviceId = getDeviceId(req);
    const assignment = await IdentityAssignment.findOne({ deviceId });

    if (!assignment) {
      return res.json({
        success: true,
        identity: null
      });
    }

    const identity = IDENTITIES.find(id => id.id === assignment.identityId);
    res.json({
      success: true,
      identity,
      account: {
        username: assignment.username,
        password: assignment.password || '123456' // Fallback to default if password not set
      }
    });
  } catch (error) {
    console.error('Get current identity error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Reset all assignments (for testing)
export const resetAllAssignments = async (req, res) => {
  try {
    await IdentityAssignment.deleteMany({});
    res.json({
      success: true,
      message: 'All identity assignments have been reset'
    });
  } catch (error) {
    console.error('Reset assignments error:', error);
    res.status(500).json({ error: error.message });
  }
};

