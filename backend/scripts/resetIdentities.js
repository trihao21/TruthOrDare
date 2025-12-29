import mongoose from 'mongoose';
import IdentityAssignment from '../models/IdentityAssignment.js';
import dotenv from 'dotenv';

dotenv.config();

async function resetIdentities() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_CONNECTIONSTRING || process.env.MONGODB_URI || 'mongodb://localhost:27017/truth-or-dare';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete all identity assignments
    const result = await IdentityAssignment.deleteMany({});
    console.log(`\n✅ Deleted ${result.deletedCount} identity assignment(s)`);
    console.log('All identities have been reset and are now available for assignment.');

  } catch (error) {
    console.error('Error resetting identities:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetIdentities();






