import moment from 'moment';
import { Markup, Scenes } from 'telegraf';
import { BirthdayModel } from '../models/birthday.model';
import { CustomContext } from '../models/context.interface';

export const BirthdayWizard = new Scenes.WizardScene<CustomContext>(
  'birthday_wizard',
  // # ask for name
  async (ctx) => {
    await ctx.reply('הכנס שם שיוצג בברכה:');
    return ctx.wizard.next();
  },

  // # validate display name, ask for birthday
  async (ctx) => {
    if (!('text' in ctx.message)) {
      return;
    }
    let name = ctx.message?.text;

    //  display name validation
    if (!name || name.length < 3 || name.length > 30 || name.startsWith('/')) {
      await ctx.reply(`
      שם התצוגה אינו חוקי. אנא נסה שנית, או הקש
      /cancel לביטול`);
      return;
    }

    // ask for date
    await ctx.reply(`מצוין, שלח תאריך לידה בפורמט: DD-MM
    (אין צורך בשנה)`);

    // add name to context
    ctx.scene.state['name'] = name;
    return ctx.wizard.next();
  },

  // # validate birthday, ask for save
  async (ctx) => {
    if (!('text' in ctx.message)) {
      return;
    }
    let birthday = ctx.message.text;
    let momentDate = moment(birthday, 'DD-MM');
    console.log('birthday', birthday, momentDate.format('DD-MM-YYYY'));

    // date validation
    if (!momentDate.isValid()) {
      await ctx.reply(`תאריך אינו תקין, אנא שלח בפורמט: DD-MM
      /cancel או הקש`);
      return;
    }

    // send "Are you sure?"
    let msg = `תודה, האם לשמור?
            \nDisplay name: ${ctx.scene.state['name']}
            \nBirthday: ${birthday}`;
    await ctx.reply(msg, Markup.inlineKeyboard([Markup.button.callback('✅', 'SAVE_BDAY'), Markup.button.callback('❌', 'CANCEL_BDAY')]));

    // add date to context
    ctx.scene.state['date'] = `${momentDate.format('DD-MM')}`;
    return ctx.wizard.next();
  }
);

// # handle cancel button
BirthdayWizard.action('CANCEL_BDAY', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(null);
  await ctx.reply('התהליך בוטל');
  return await ctx.scene.leave();
});

// # handle save button
BirthdayWizard.action('SAVE_BDAY', async (ctx) => {
  await new BirthdayModel({
    name: (<any>ctx).wizard.state.name,
    birthday: (<any>ctx).wizard.state.birthday,
  }).save();
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(null);
  await ctx.reply('נשמר בהצלחה');
  return await ctx.scene.leave();
});

// # handle /cancel command
BirthdayWizard.command('cancel', async (ctx) => {
  await ctx.reply('תהליך נוכחי בוטל.');
  return await ctx.scene.leave();
});
