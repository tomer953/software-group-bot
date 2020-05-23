import dotenv from "dotenv";
import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { registerUserMiddleware } from './controllers/user.controller';
import { User } from "telegraf/typings/telegram-types";

dotenv.config(); // init .env file in dev

// read config
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "";

// create new bot
const bot = new Telegraf(BOT_TOKEN);

// webhooks on prod, polling on dev
if (process.env.NODE_ENV === 'PROD') {
    bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
    bot.startWebhook(`/bot${BOT_TOKEN}`, null, +PORT);
} else {
    bot.startPolling();
}
exports.bot = bot;

// use middlewares
bot.use(registerUserMiddleware)

// apply logic
bot.command('ping', (ctx: TelegrafContext) => {
    let user: any = (<any>ctx).user;
    ctx.reply(user.first_name + ', pong!');
})

// connect to db
require('./db').connect().catch((err: any) => console.log('unable to connect to db'))

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');
