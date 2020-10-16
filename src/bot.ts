import { bot } from './index';
import { registerUserMiddleware, isAdminMiddleware } from './controllers/user.controller';
import { session, Stage } from 'telegraf'
import { BirthdayWizard } from './scenes/birthday.scene'
import { addBirthdayMiddleware, birthdaySchedular } from './controllers/birthday.controller';
import schedule from 'node-schedule';
import { getQuoteMiddleware, quoteSchedular, toggleQuotesMiddleware } from './controllers/quote.controller';
import { getCoronaMiddleware, changeCoronaPageHandler, sendCoronaDataHandler, updateCoronaCountries } from './controllers/corona.controller';
import { pingHeroku, pingMiddleware } from './controllers/ping.controller';
import { statsMiddleware } from './controllers/statistics.controller';
import { getShabatMiddleware } from './controllers/shabat.controller';


// Scenes registration
const stage = new Stage([
    BirthdayWizard
]);

// get bot username, and allow /command@BotUserName in groups
bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
})

// register middlewares
bot.use(session());
bot.use((<any>stage).middleware());
bot.use(registerUserMiddleware) // add ctx.user
bot.use(statsMiddleware);       // update statistics

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

// initialize schedulars
const GMT: number = +(process.env.GMT || 3);
schedule.scheduleJob({ hour: (7 - GMT), minute: 30 }, birthdaySchedular); // check for birthdays
schedule.scheduleJob({ dayOfWeek: 4, hour: (13 - GMT), minute: 0 }, quoteSchedular);   // send daily quote
schedule.scheduleJob("*/10 * * * *", updateCoronaCountries);     // update corona data every 10 minutes
schedule.scheduleJob("*/10 * * * *", pingHeroku);                // ping own app to prevent idle