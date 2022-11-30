import mongoose from 'mongoose';
import { Config } from './config/config';

export async function connectToDb() {
  try {
    console.log(`DB -> Trying to connect`);
    await mongoose.connect(Config.DB_URL);
  } catch (error) {
    console.error(error);
    console.log(`DB -> Failed to init connection, abort app`);
  }
}

export const db = mongoose.connection;

// emitted if an error occurs on a connection
db.on('error', (err) => console.error(err));
// emitted when mongoose successfully make its initial connection to mongoDB, or when mongoose reconnects after losing connectivity
db.on('connected', () => console.log(`DB -> Connected to db`));
// emitted if mongoose lost connectivity to MongoDB and successfully reconnected
db.on('reconnected', () => console.log(`DB -> Reconnected to db`));
