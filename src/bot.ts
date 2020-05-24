import { bot } from './index';
import { TelegrafContext } from 'telegraf/typings/context';
import { registerUserMiddleware, isAdminMiddleware } from './controllers/user.controller';
import { session, Stage } from 'telegraf'
import { BirthdayWizard } from './scenes/birthday.scene'
import { addBirthdayMiddleware, birthdaySchedular } from './controllers/birthday.controller';
import schedule from 'node-schedule';
import { getQuoteMiddleware, quoteSchedular } from './controllers/quote.controller';
import { getCoronaMiddleware, changeCoronaPageHandler, sendCoronaDataHandler, updateCoronaCountries } from './controllers/corona.controller';
import { pingHeroku } from './controllers/ping.controller';


// Scenes registration
const stage = new Stage([
    BirthdayWizard
]);

// register middlewares
bot.use(session());
bot.use((<any>stage).middleware());
bot.use(registerUserMiddleware) // add ctx.user

// handle commands
bot.command('/add_birthday', isAdminMiddleware, addBirthdayMiddleware);
bot.command('/quote', getQuoteMiddleware);
bot.command('/corona', getCoronaMiddleware);

bot.command('ping', (ctx: TelegrafContext) => {
    let user: any = (<any>ctx).user;
    ctx.reply(user.first_name + ', pong!');
})

// handle buttons callbacks
bot.action(/CORONA:NAV:(.+)/, changeCoronaPageHandler);
bot.action(/CORONA:DATA:(.+)/, sendCoronaDataHandler);

// initialize schedulars
const GMT: number = +(process.env.GMT || 3);
schedule.scheduleJob({ hour: (7-GMT), minute: 30 }, birthdaySchedular); // check for birthdays
schedule.scheduleJob({ hour: (13-GMT), minute: 30 }, quoteSchedular);   // send daily quote
schedule.scheduleJob("*/10 * * * *", updateCoronaCountries);     // update corona data every 10 minutes
schedule.scheduleJob("*/10 * * * *", pingHeroku);                // ping own app to prevent idle