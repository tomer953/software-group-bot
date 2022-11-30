import { Context } from 'telegraf';
import { User } from './user.model';

// Define your own context type
export interface CustomContext extends Context {
  user: User;
  isAdmin: boolean;
}
