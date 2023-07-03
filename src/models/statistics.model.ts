import mongoose, { Schema } from 'mongoose';

export interface UserStats {
  userId: number;
  chatId: number;
  chatType: number;
  date: Date;
  messages: number;
  words: number;
  commands: number;
  photos: number;
  audio: number;
  documents: number;
  gifs: number;
  stickers: number;
  videos: number;
}

const schema = new Schema<UserStats>(
  {
    userId: { type: Number, ref: 'User' },
    chatId: Number,
    chatType: String,
    date: Date,
    messages: Number,
    words: Number,
    commands: Number,
    photos: Number,
    audio: Number,
    documents: Number,
    gifs: Number,
    stickers: Number,
    videos: Number,
  },
  { timestamps: true }
);

export const UserStatsModel = mongoose.model<UserStats>('Statistics', schema);
