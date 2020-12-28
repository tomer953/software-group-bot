import { bot } from './index';
import { registerUserMiddleware, isAdminMiddleware } from './controllers/user.controller';
import { session, Stage } from 'telegraf'
import { BirthdayWizard } from './scenes/birthday.scene'
import { addBirthdayMiddleware } from './controllers/birthday.controller';
import { getQuoteMiddleware, toggleQuotesMiddleware } from './controllers/quote.controller';
import { getCoronaMiddleware, changeCoronaPageHandler, sendCoronaDataHandler } from './controllers/corona.controller';
import { pingMiddleware } from './controllers/ping.controller';
import { statsMiddleware } from './controllers/statistics.controller';
import { getShabatMiddleware } from './controllers/shabat.controller';
import { initSchedulars } from './controllers/schedulars.controller';


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

// initializee bot schedular
initSchedulars();
