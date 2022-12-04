import express from 'express';
import { Telegraf } from 'telegraf';

import { Config } from './config/config';
import { connectToDb } from './db';
import { CustomContext } from './models/context.interface';
import { registerUserMiddleware } from './controllers/user.controller';
import { initSchedulars } from './controllers/schedulars.controller';

// commands
import { pingMiddleware } from './controllers/ping.controller';
import { getQuoteMiddleware } from './controllers/quote.controller';


const { PORT, BOT_TOKEN } = Config;
// create new bot
export const bot = new Telegraf<CustomContext>(BOT_TOKEN);
const app = express();

// Scenes registration
// const stage = new Scenes.Stage([BirthdayWizard]);

// register middlewares
// bot.use(stage.middleware());
bot.use(registerUserMiddleware); // add ctx.user
// bot.use(statsMiddleware); // update statistics

// handle commands
bot.command('ping', pingMiddleware);
bot.command('quote', getQuoteMiddleware);
// bot.command('add_birthday', isAdminMiddleware, addBirthdayMiddleware);
// bot.command('toggle_quotes', isAdminMiddleware, toggleQuotesMiddleware);
// bot.command('corona', getCoronaMiddleware);
// bot.command('shabat', getShabatMiddleware);

// handle buttons callbacks
// bot.action(/CORONA:NAV:(.+)/, changeCoronaPageHandler);
// bot.action(/CORONA:DATA:(.+)/, sendCoronaDataHandler);

async function main() {
  try {
    await connectToDb();
    bot.botInfo = await bot.telegram.getMe();
    
    let msg = `
    Bot is running.
    PORT: ${PORT}
    BOT: ${bot.botInfo?.username}
    DATE: ${new Date()}
    `;
    
    bot.launch();
    app.listen(PORT, () => console.log(msg));
  } catch (err) {
    console.log(err);
  }

  // initializee bot schedular
  initSchedulars();
}

main();
