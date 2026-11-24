import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './env';

let mongodInstance: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    // Try connecting to specified or local MongoDB URI first with 2.5s timeout
    mongoose.set('strictQuery', false);
    
    // Test if external MongoDB is available
    const isLocalUri = ENV.MONGODB_URI.includes('127.0.0.1') || ENV.MONGODB_URI.includes('localhost');
    
    let connected = false;
    if (isLocalUri) {
      try {
        await mongoose.connect(ENV.MONGODB_URI, {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`[Database] Connected to external MongoDB at ${ENV.MONGODB_URI}`);
        connected = true;
      } catch (err) {
        console.log('[Database] Local MongoDB daemon not active, starting embedded MongoDB Memory Server...');
      }
    } else {
      await mongoose.connect(ENV.MONGODB_URI);
      console.log(`[Database] Connected to remote MongoDB at ${ENV.MONGODB_URI}`);
      connected = true;
    }

    if (!connected) {
      // Start in-memory MongoDB
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'salonflow',
        },
      });
      const uri = mongodInstance.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Embedded MongoDB Server running at ${uri}`);
    }
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
