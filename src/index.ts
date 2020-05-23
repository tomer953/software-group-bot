import dotenv from "dotenv";
import { Telegraf } from 'telegraf';

// init .env file in dev
dotenv.config();

// read config
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "";

// create new bot
const bot = new Telegraf(BOT_TOKEN);
export { bot };

// load bot.ts file with all logic
require('./bot');

// start bot -> webhooks on prod, polling on dev
if (process.env.NODE_ENV === 'PROD') {
    bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
    bot.startWebhook(`/bot${BOT_TOKEN}`, null, +PORT);
} else {
    bot.startPolling();
}

// connect to db
require('./db').connect().catch((err: any) => console.log('unable to connect to db'))

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');
