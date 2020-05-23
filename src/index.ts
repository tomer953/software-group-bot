import dotenv from "dotenv";
import { Telegraf, Middleware } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

dotenv.config(); // init .env file

// read config
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "";

// create new bot
const bot = new Telegraf(BOT_TOKEN);
exports.bot = bot;

// apply logic
bot.command('ping', (ctx: TelegrafContext) => {
    console.log(ctx.botInfo);
    ctx.reply('pong with webhooks');
})


// connect to db
require('./db').connect().catch((err: any) => console.log('unable to connect to db'))

// start bot (webhooks method)
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, +PORT);