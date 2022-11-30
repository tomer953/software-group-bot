import { MiddlewareFn } from 'telegraf';
import { CustomContext } from '../models/context.interface';
import { UserModel } from './../models/user.model';

// for every incoming message, add the user to db
// if already exists, add it to the ctx.user for other functions to use
export const registerUserMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  if (ctx.updateType == 'message') {
    let message = ctx.message;
    if (message) {
      let user = await UserModel.findById(message?.from?.id);
      if (!user) {
        user = await new UserModel({
          _id: message?.from?.id,
          ...message.from,
        }).save();
      }

      ctx.user = user;

      // add isAdmin to ctx for simple check
      if (user.role === 'admin') {
        ctx.isAdmin = true;
      }
    }
  }
  await next();
};

export const isAdminMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  if (!ctx.isAdmin) {
    return ctx.reply('Unauthorized access.');
  }
  return await next();
};
