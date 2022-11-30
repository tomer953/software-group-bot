import mongoose, { Schema } from 'mongoose';

export interface User {
  _id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
  role: 'user' | 'admin';
}

const schema = new Schema<User>(
  {
    _id: Number,
    is_bot: Boolean,
    first_name: String,
    username: String,
    language_code: String,
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>('User', schema);
