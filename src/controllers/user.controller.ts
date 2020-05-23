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

            // add isAdmin to ctx for simple check
            if (user.role == 'admin') {
                (<any>ctx).isAdmin = true;
            }
        }
    }
    await next();
}

export async function isAdminMiddleware(ctx: TelegrafContext, next: () => Promise<void>) {
    if (!(<any>ctx).isAdmin) {
        return ctx.reply('Unauthorized access.')
    }
    return await next();
}