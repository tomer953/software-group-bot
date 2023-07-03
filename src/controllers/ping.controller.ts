import { MiddlewareFn } from 'telegraf';
import { CustomContext } from '../models/context.interface';

export const pingMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  try {
    console.log('inside ping')
    let user = ctx.user;
    ctx.reply(user.first_name + ', pong!');
  } catch (error) {
    console.log(error);
  }
};
