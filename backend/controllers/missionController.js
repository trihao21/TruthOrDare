import Mission from '../models/Mission.js';
import MissionSubmission from '../models/MissionSubmission.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { emailService } from '../services/emailService.js';

// Helper to convert buffer to stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Create new mission
export const createMission = async (req, res) => {
  try {
    const { name, location, startTime, endTime, requiredMembers, penaltyTime } = req.body;

    if (!name || !location || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mission = new Mission({
      name,
      location,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      requiredMembers: requiredMembers || 1,
      penaltyTime: penaltyTime || 300,
      status: new Date(startTime) <= new Date() ? 'active' : 'pending'
    });

    await mission.save();
    res.status(201).json({ mission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all missions
export const getMissions = async (req, res) => {
  try {
    let missions = await Mission.find().sort({ startTime: 1 });
    
    // If no missions exist, create default ones
    if (missions.length === 0) {
      console.log('No missions found, creating default missions...');
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

      const defaultMissions = [
        {
          name: 'Đi ăn',
          location: 'Nhà hàng',
          startTime: now,
          endTime: oneHourLater,
          requiredMembers: 1,
          status: 'active',
          penaltyTime: 300
        },
        {
          name: 'Đi chụp photobooth',
          location: 'Studio',
          startTime: oneHourLater,
          endTime: twoHoursLater,
          requiredMembers: 1,
          status: 'pending',
          penaltyTime: 300
        },
        {
          name: 'Đi nhậu',
          location: 'Quán bar',
          startTime: twoHoursLater,
          endTime: threeHoursLater,
          requiredMembers: 1,
          status: 'pending',
          penaltyTime: 300
        }
      ];

      try {
        missions = await Mission.insertMany(defaultMissions);
        console.log(`Created ${missions.length} default missions`);
      } catch (insertError) {
        console.error('Error creating default missions:', insertError);
        // If insert fails, return empty array instead of throwing
        missions = [];
      }
    }
    
    console.log(`Returning ${missions.length} missions`);
    res.json({ missions });
  } catch (error) {
    console.error('Error in getMissions:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get mission by ID
export const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    res.json({ mission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload image and submit mission
export const submitMission = async (req, res) => {
  try {
    const { missionId, userId } = req.body;

    if (!missionId || !userId) {
      return res.status(400).json({ error: 'Mission ID and User ID are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Check if mission exists and is active
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    const now = new Date();
    if (now < mission.startTime) {
      return res.status(400).json({ error: 'Mission has not started yet' });
    }

    if (now > mission.endTime) {
      return res.status(400).json({ error: 'Mission has expired' });
    }

    // Check if user already submitted
    const existingSubmission = await MissionSubmission.findOne({ missionId, userId });
    if (existingSubmission) {
      return res.status(400).json({ error: 'You have already submitted for this mission' });
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'hipdam-missions',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }

        try {
          const timeUntilEnd = (mission.endTime - now) / 1000; // seconds
          const isLate = timeUntilEnd <= mission.penaltyTime;

          // Create submission first
          const submission = new MissionSubmission({
            missionId,
            userId,
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
            submittedAt: now,
            isPenalty: false,
            penaltyReason: null
          });

          await submission.save();

          // Check if this is the last submission (submittedAt is the latest)
          const allSubmissions = await MissionSubmission.find({ missionId }).sort({ submittedAt: -1 });
          const isLast = allSubmissions.length > 0 && allSubmissions[0]._id.toString() === submission._id.toString();

          // Determine penalty
          if (isLast || isLate) {
            submission.isPenalty = true;
            if (isLast && isLate) {
              // If both conditions, prioritize late_submission
              submission.penaltyReason = 'late_submission';
            } else if (isLast) {
              submission.penaltyReason = 'last_submission';
            } else if (isLate) {
              submission.penaltyReason = 'late_submission';
            }
            await submission.save();
          }

          res.status(201).json({
            submission,
            message: 'Mission submitted successfully'
          });
        } catch (dbError) {
          // Delete from Cloudinary if DB save fails
          await cloudinary.uploader.destroy(result.public_id);
          res.status(500).json({ error: dbError.message });
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    bufferToStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get submissions for a mission
export const getMissionSubmissions = async (req, res) => {
  try {
    const { missionId } = req.params;
    const submissions = await MissionSubmission.find({ missionId })
      .sort({ submittedAt: 1 })
      .populate('missionId', 'name location');
    
    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await MissionSubmission.find({ userId })
      .populate('missionId', 'name location startTime endTime')
      .sort({ submittedAt: -1 });
    
    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Notify mission unlock via email
export const notifyMissionUnlock = async (req, res) => {
  try {
    const { missionId, userEmail } = req.body;

    if (!missionId || !userEmail) {
      return res.status(400).json({ error: 'Mission ID and user email are required' });
    }

    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Send email notification
    const emailResult = await emailService.sendMissionUnlockEmail(userEmail, mission);

    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: 'Unlock notification email sent successfully',
        messageId: emailResult.messageId
      });
    } else {
      // Don't fail the request if email fails, just log it
      console.warn('Failed to send unlock email:', emailResult.error);
      res.json({ 
        success: false, 
        message: 'Mission unlock detected but email notification failed',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error in notifyMissionUnlock:', error);
    res.status(500).json({ error: error.message });
  }
};

