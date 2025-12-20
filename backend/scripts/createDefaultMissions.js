import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from '../models/Mission.js';
import connectDB from '../config/db.js';

dotenv.config();

const createDefaultMissions = async () => {
  try {
    await connectDB();

    // Clear existing missions
    await Mission.deleteMany({});

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now

    const missions = [
      {
        name: 'Đi ăn',
        location: 'Nhà hàng',
        startTime: now,
        endTime: oneHourLater,
        requiredMembers: 1,
        status: 'active',
        penaltyTime: 300 // 5 minutes
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

    const createdMissions = await Mission.insertMany(missions);
    console.log('✅ Created default missions:');
    createdMissions.forEach(mission => {
      console.log(`  - ${mission.name} (${mission._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating missions:', error);
    process.exit(1);
  }
};

createDefaultMissions();


