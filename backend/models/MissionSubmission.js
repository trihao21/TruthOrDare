import mongoose from 'mongoose';

const missionSubmissionSchema = new mongoose.Schema({
  missionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  userId: {
    type: String, // email from mission auth
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  isPenalty: {
    type: Boolean,
    default: false
  },
  penaltyReason: {
    type: String,
    enum: ['last_submission', 'late_submission', null],
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
missionSubmissionSchema.index({ missionId: 1, userId: 1 });
missionSubmissionSchema.index({ missionId: 1, submittedAt: 1 });

export default mongoose.model('MissionSubmission', missionSubmissionSchema);







