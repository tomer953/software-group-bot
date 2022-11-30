import moment from 'moment';
import { Markup, Context } from 'telegraf';
import { WizardScene } from 'telegraf/typings/scenes';
import { BirthdayModel } from '../models/birthday.model';

export const BirthdayWizard = new WizardScene(
  'birthday_wizard',

  // 1. ask display name
  (ctx: Context) => {
    ctx.reply('הכנס שם שיוצג בברכה:');
    return (<any>ctx).wizard.next();
  },

  // 2. validate display name, ask for birthday
  (ctx: Context) => {
    if (!('text' in ctx.message)) {
      return;
    }
    let name = ctx.message?.text;

    if (ctx.message?.text?.startsWith('/cancel')) {
      ctx.reply('תהליך נוכחי בוטל.');
      (<any>ctx).scene.leave();
      return;
    }

    //  display name validation
    if (!name || name.length < 3 || name.length > 30 || name.startsWith('/')) {
      ctx.reply('שם התצוגה אינו חוקי. אנא נסה שנית, או הקש/n/cancel לביטול');
      return;
    }

    ctx.reply('מצוין, שלח תאריך לידה בפורמט: DD-MM-YYYY\nאם השנה לא ידועה הכנס סתם שנה');
    (<any>ctx).wizard.state.name = name;
    return (<any>ctx).wizard.next();
  },
  // 3. validate birthday, ask for save
  (ctx: Context) => {
    if (!('text' in ctx.message)) {
      return;
    }

    if (ctx.message?.text?.startsWith('/cancel')) {
      ctx.reply('תהליך נוכחי בוטל.');
      (<any>ctx).scene.leave();
      return;
    }

    let birthday = (<any>ctx).message.text;
    let momentDate = moment(birthday, 'DD-MM-YYYY');

    // date validation
    if (!momentDate.isValid()) {
      ctx.reply('תאריך אינו תקין, אנא שלח בפורמט: DD-MM-YYYY\n/cancel או הקש');
      return;
    }

    let _msg = `תודה, האם לשמור?
        \nDisplay name: ${(<any>ctx).wizard.state.name}
        \nBirthday: ${birthday}`;
    let keyboard = Markup.inlineKeyboard([Markup.callbackButton('✅', 'SAVE_BDAY'), Markup.callbackButton('❌', 'CANCEL_BDAY')]).extra();
    ctx.reply(_msg, keyboard);

    (<any>ctx).wizard.state.birthday = `${momentDate.format('DD-MM-YYYY')}`;
    return (<any>ctx).wizard.next();
  },
  // wait for save or cancel
  async (ctx: Context) => {
    if (ctx.updateType == 'callback_query') {
      if (ctx.callbackQuery?.data == 'SAVE_BDAY') {
        ctx.answerCbQuery();
        await new BirthdayModel({
          name: (<any>ctx).wizard.state.name,
          birthday: (<any>ctx).wizard.state.birthday,
        }).save();
        ctx.editMessageText('נשמר בהצלחה');
        (<any>ctx).scene.leave();
      } else if (ctx.callbackQuery?.data == 'CANCEL_BDAY') {
        ctx.answerCbQuery();
        ctx.editMessageText('התהליך בוטל');
        (<any>ctx).scene.leave();
      }
    } else if (ctx.updateType == 'message') {
      if (!('text' in ctx.message)) {
        return;
      }
      if (ctx.message?.text?.startsWith('/cancel')) {
        ctx.reply('תהליך נוכחי בוטל.');
        (<any>ctx).scene.leave();
      } else {
        ctx.reply('תהליך פעיל, כדי לבטל אותו לחץ על\n/cancel');
      }
    }
  }
);
