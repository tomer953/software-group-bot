import mongoose, { Schema } from 'mongoose';
import { User } from './user.model';

export interface Birthday {
  user: User;
  name: string;
  gender: 'male' | 'female';
  birthday: string;
}
const schema = new Schema<Birthday>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    gender: { type: String, enum: ['female', 'male'], default: 'male' },
    birthday: String,
  },
  { timestamps: true }
);

export const BirthdayModel = mongoose.model<Birthday>('Birthday', schema);
