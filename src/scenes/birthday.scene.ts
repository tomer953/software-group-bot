import moment = require('moment');
import { Markup, Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/stage';
import { MessageEntity } from 'telegraf/typings/telegram-types';

const WizardScene = require('telegraf/scenes/wizard');
const Birthday = require('../models/birthday.model');

const scene = new WizardScene("birthday_wizard",

    // 1. ask display name
    (ctx: Context) => {
        ctx.reply("User display name (as will appear in the greeting):")
        return (<any>ctx).wizard.next();
    },

    // 2. validate display name, ask for birthday
    (ctx: Context) => {
        let name = ctx.message?.text;

        if (ctx.message?.text?.startsWith('/cancel')) {
            ctx.reply('Aborting current wizard');
            (<any>ctx).scene.leave()
            return;
        }

        //  display name validation
        if (!name || name.length < 3 || name.length > 30 || name.startsWith('/')) {
            ctx.reply('invalid display name, try again or type /cancel to abort');
            return;
        }

        ctx.reply('Ok, now send me the birthday: DD-MM-YYYY');
        (<any>ctx).wizard.state.name = name;
        return (<any>ctx).wizard.next();
    },
    // 3. validate birthday, ask for save
    (ctx: Context) => {

        if (ctx.message?.text?.startsWith('/cancel')) {
            ctx.reply('Aborting current wizard');
            (<any>ctx).scene.leave()
            return;
        }

        let birthday = (<any>ctx).message.text;
        let momentDate = moment(birthday, 'DD-MM-YYYY')
        momentDate.hour(7);

        // date validation
        if (!momentDate.isValid()) {
            ctx.reply('Invalid date - send me the birthday: DD-MM-YYYY or type /cancel to abort');
            return;
        }

        let _msg = `Ok, should I save?
        \nDisplay name: ${(<any>ctx).wizard.state.name}
        \nBirthday: ${birthday}`
        let keyboard = Markup.inlineKeyboard([
            Markup.callbackButton("✅", "SAVE_BDAY"),
            Markup.callbackButton("❌", "CANCEL_BDAY")
        ]).extra()
        ctx.reply(_msg, keyboard);

        (<any>ctx).wizard.state.birthday = momentDate.toDate();
        return (<any>ctx).wizard.next();
    },
    // wait for save or cancel
    async (ctx: Context) => {
        if (ctx.updateType == 'callback_query') {

            if (ctx.callbackQuery?.data == "SAVE_BDAY") {
                console.log("SAVE!");
                ctx.answerCbQuery();
                ctx.editMessageText("Saved.");
                await new Birthday({
                    name: (<any>ctx).wizard.state.name,
                    birthday: (<any>ctx).wizard.state.birthday
                }).save();
                (<any>ctx).scene.leave();

            } else if (ctx.callbackQuery?.data == "CANCEL_BDAY") {
                console.log("CANCEL");
                ctx.answerCbQuery();
                ctx.editMessageText("Cancled");
                (<any>ctx).scene.leave();

            }
        } else if (ctx.updateType == 'message') {
            if (ctx.message?.text?.startsWith('/cancel')) {
                ctx.reply('Aborting current wizard');
                (<any>ctx).scene.leave()

            } else {
                ctx.reply('You are in the middle of wizard, type /cancel to abort.');
            }
        }
    }
);

export { scene as BirthdayWizard }