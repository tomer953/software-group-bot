import { Context } from "telegraf";
const Statistics = require('../models/statistics.model');

export async function statsMiddleware(ctx: Context, next: () => Promise<void>) {
    try {
        if (ctx.updateType == 'message' && ctx.message) {
            let message = ctx.message;

            let userId = message.from?.id;
            let chatId = message.chat.id;
            let chatType = message.chat.type;

            // today, without time
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            // get the current statistics document (create if not exist)
            let filter = { userId, chatId, chatType, date };
            let update = {};
            let doc = await Statistics.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });
            // update user
            let incQuery: any = {};

            if (message.text) {
                incQuery.messages = 1;                                      // inc messages
                if (message.text.startsWith('/')) {
                    incQuery.commands = 1;                                  // inc commands
                } else {
                    incQuery.words = message.text.trim().split(" ").length      // inc words
                }

            }
            // inc photos
            if (message.photo) {
                incQuery.photos = 1;
            }
            // inc documents\gifs
            if (message.document) {
                if (message.document.file_name == 'giphy.mp4' && message.document.mime_type == 'video/mp4') {
                    incQuery.gifs = 1; // inc gifs
                }
                else {
                    incQuery.documents = 1; // inc documents
                }
            }
            // inc audio
            if (message.audio || message.voice) {
                incQuery.audio = 1;
            }
            // inc stickers
            if (message.sticker) {
                incQuery.stickers = 1;
            }
            // inc videos
            if (message.video) {
                incQuery.videos = 1;
            }
            await doc.updateOne({ $inc: incQuery });
        }
        await next();
    } catch (error) {
        console.log(error);
        await next(); // continue if fails
    }

}
