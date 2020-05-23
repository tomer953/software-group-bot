import { bot } from './index';
import { TelegrafContext } from 'telegraf/typings/context';
import { registerUserMiddleware, isAdminMiddleware } from './controllers/user.controller';
import { session, Stage } from 'telegraf'
import { BirthdayWizard } from './scenes/birthday.scene'
import { addBirthdayMiddleware } from './controllers/birthday.controller';

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

bot.command('ping', (ctx: TelegrafContext) => {
    let user: any = (<any>ctx).user;
    ctx.reply(user.first_name + ', pong!');
})