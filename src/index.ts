import { Scenes, Telegraf } from 'telegraf';

import { Config } from './config/config';
import { addBirthdayMiddleware } from './controllers/birthday.controller';
import { getCoronaMiddleware, changeCoronaPageHandler, sendCoronaDataHandler } from './controllers/corona.controller';
import { pingMiddleware } from './controllers/ping.controller';
import { getQuoteMiddleware, toggleQuotesMiddleware } from './controllers/quote.controller';
import { initSchedulars } from './controllers/schedulars.controller';
import { getShabatMiddleware } from './controllers/shabat.controller';
import { statsMiddleware } from './controllers/statistics.controller';
import { registerUserMiddleware, isAdminMiddleware } from './controllers/user.controller';
import { connectToDb } from './db';
import { CustomContext } from './models/context.interface';
import { BirthdayWizard } from './scenes/birthday.scene';

const { PORT, BOT_TOKEN, HOST_URL } = Config;
// create new bot
export const bot = new Telegraf<CustomContext>(BOT_TOKEN);

// Scenes registration
const stage = new Scenes.Stage([BirthdayWizard]);

// register middlewares
bot.use(stage.middleware());
bot.use(registerUserMiddleware); // add ctx.user
bot.use(statsMiddleware); // update statistics

// handle commands
bot.command('ping', pingMiddleware);
bot.command('add_birthday', isAdminMiddleware, addBirthdayMiddleware);
bot.command('quote', getQuoteMiddleware);
bot.command('toggle_quotes', isAdminMiddleware, toggleQuotesMiddleware);
bot.command('corona', getCoronaMiddleware);
bot.command('shabat', getShabatMiddleware);

// handle buttons callbacks
bot.action(/CORONA:NAV:(.+)/, changeCoronaPageHandler);
bot.action(/CORONA:DATA:(.+)/, sendCoronaDataHandler);

async function main() {
  try {
    await connectToDb();

    // start bot -> webhooks on prod, polling on dev
    if (Config.NODE_ENV === 'production') {
      bot.telegram.setWebhook(`${HOST_URL}/bot${BOT_TOKEN}`);
      // `/bot${BOT_TOKEN}`, null, Config.PORT
      bot.launch({
        webhook: {
          port: PORT,
          domain: HOST_URL,
        },
      });
    } else {
      bot.launch();
    }
    console.log(`App is running "local" on port ${PORT}...`);
  } catch (err) {
    console.log(err);
  }

  // initializee bot schedular
  initSchedulars();
}

main();
