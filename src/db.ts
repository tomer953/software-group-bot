// connect to db (mongodb + mongoose)
import mongoose from 'mongoose';

const DB_URL = process.env.DB_URL || "";
exports.connect = () => mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))