import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Đi ăn', 'Đi chụp photobooth', 'Đi nhậu']
  },
  location: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  requiredMembers: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'expired'],
    default: 'pending'
  },
  penaltyTime: {
    type: Number, // seconds before endTime to start penalty
    default: 300 // 5 minutes default
  }
}, {
  timestamps: true
});

export default mongoose.model('Mission', missionSchema);









