import { Middleware } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
const User = require('../models/user.model');

// for every incoming message, add the user to db
// if already exists, add it to the ctx.user for other functions to use
export async function registerUserMiddleware(ctx: TelegrafContext, next: () => Promise<void>) {
    if (ctx.updateType == 'message') {
        let message = ctx.update.message;
        if (message) {
            let user = await User.findById(message?.from?.id);
            if (!user) {
                user = await new User({ _id: message?.from?.id, ...message.from }).save()
            }
            (<any>ctx).user = user;
        }
    }
    await next();
}