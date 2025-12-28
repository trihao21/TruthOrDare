import mongoose from 'mongoose';

const IdentityAssignmentSchema = new mongoose.Schema(
  {
    identityId: {
      type: String,
      required: true,
      unique: true,
      enum: ['player_1', 'player_2', 'player_3', 'player_4', 'player_5', 'player_6', 'player_7', 'player_8']
    },
    deviceId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
IdentityAssignmentSchema.index({ identityId: 1 });
IdentityAssignmentSchema.index({ deviceId: 1 });

export default mongoose.model('IdentityAssignment', IdentityAssignmentSchema);

