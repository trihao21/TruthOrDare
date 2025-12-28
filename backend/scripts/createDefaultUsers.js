import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultUsers = [
  {
    username: 'admin',
    email: 'admin@game.com',
    password: 'admin123',
    displayName: 'Quản trị viên',
    role: 'admin'
  },
  {
    username: 'player1',
    email: 'player1@game.com',
    password: '123456',
    displayName: 'Người chơi 1',
    role: 'user'
  },
  {
    username: 'player2',
    email: 'player2@game.com',
    password: '123456',
    displayName: 'Người chơi 2',
    role: 'user'
  },
  {
    username: 'player3',
    email: 'player3@game.com',
    password: '123456',
    displayName: 'Người chơi 3',
    role: 'user'
  },
  {
    username: 'player4',
    email: 'player4@game.com',
    password: '123456',
    displayName: 'Người chơi 4',
    role: 'user'
  },
  {
    username: 'player5',
    email: 'player5@game.com',
    password: '123456',
    displayName: 'Người chơi 5',
    role: 'user'
  },
  {
    username: 'player6',
    email: 'player6@game.com',
    password: '123456',
    displayName: 'Người chơi 6',
    role: 'user'
  },
  {
    username: 'player7',
    email: 'player7@game.com',
    password: '123456',
    displayName: 'Người chơi 7',
    role: 'user'
  },
  {
    username: 'player8',
    email: 'player8@game.com',
    password: '123456',
    displayName: 'Người chơi 8',
    role: 'user'
  }
];

async function createDefaultUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_CONNECTIONSTRING || process.env.MONGODB_URI || 'mongodb://localhost:27017/truth-or-dare';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if users already exist
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ 
        $or: [{ username: userData.username }, { email: userData.email }] 
      });

      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping...`);
        continue;
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.username} (${userData.displayName})`);
    }

    console.log('\n✅ Default users creation completed!');
    console.log('\n📋 Available accounts:');
    console.log('👑 ADMIN: Username: admin, Password: admin123');
    console.log('👤 USER: Username: player1, Password: 123456');
    console.log('👤 USER: Username: player2, Password: 123456');
    console.log('👤 USER: Username: player3, Password: 123456');
    console.log('👤 USER: Username: player4, Password: 123456');
    console.log('👤 USER: Username: player5, Password: 123456');
    console.log('👤 USER: Username: player6, Password: 123456');
    console.log('👤 USER: Username: player7, Password: 123456');
    console.log('👤 USER: Username: player8, Password: 123456');

  } catch (error) {
    console.error('Error creating default users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createDefaultUsers();