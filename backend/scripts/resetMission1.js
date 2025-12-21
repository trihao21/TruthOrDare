import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from '../models/Mission.js';
import connectDB from '../config/db.js';

dotenv.config();

const resetMission1 = async () => {
  try {
    await connectDB();

    // Find mission 1 (Đi ăn)
    const mission = await Mission.findOne({ name: 'Đi ăn' });
    
    if (!mission) {
      console.log('❌ Mission "Đi ăn" not found');
      process.exit(1);
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    // Update mission 1 with new times
    mission.startTime = now;
    mission.endTime = oneHourLater;
    mission.status = 'active';
    
    await mission.save();
    
    console.log('✅ Mission 1 (Đi ăn) has been reset:');
    console.log(`   Start Time: ${now.toLocaleString('vi-VN')}`);
    console.log(`   End Time: ${oneHourLater.toLocaleString('vi-VN')}`);
    console.log(`   Status: active`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting mission 1:', error);
    process.exit(1);
  }
};

resetMission1();


