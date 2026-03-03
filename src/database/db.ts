import mongoose from 'mongoose';
import { envs } from '../config/env';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(envs.MONGO_URI);
    console.log('MongoDB connected successfully', connection.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
