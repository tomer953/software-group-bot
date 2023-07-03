import moment from 'moment';
import { MiddlewareFn } from 'telegraf';
import { sample } from 'lodash';

import { Birthday, BirthdayModel } from '../models/birthday.model';
import { bot } from '../index';
import { Config } from '../config/config';
import { CustomContext } from '../models/context.interface';
import { BDAY_EMOJIS, BDAY_GREETS, BDAY_STICKERS } from './greets';
import { isTodayBirthday } from '../helpers/dates';
// group id to send the bday message
let groupId = Config.GROUP_CHAT_ID;

export const addBirthdayMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  try {
    console.log('ctx.scene', ctx.wizard);
    await ctx.scene.enter('birthday_wizard');
  } catch (error) {
    console.log(error);
  }
};

export async function birthdaySchedular() {
  try {
    console.log('looking for birthdays...');
    let bdays = await BirthdayModel.find();

    for (const bday of bdays) {
      let momentBirthday = moment(bday.birthday, 'DD-MM-YYYY');
      if (isTodayBirthday(momentBirthday.toDate())) {
        // send happy birthday msg + sticker
        let { greet, sticker } = getGreeting(bday);
        await bot.telegram.sendMessage(groupId, greet);
        await bot.telegram.sendSticker(groupId, sticker);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function getGreeting(bday: Birthday) {
  // get random stickers and greeting (or use db if specified)
  let sticker = bday.stickerId || sample(BDAY_STICKERS);
  let greet = bday.greeting || sample(BDAY_GREETS);

  // for females, change the greeting
  if (bday.gender === 'female') {
    greet = greet.replace(/אתה/g, 'את');
  }

  // if its not a custom greet, add the name and emoji to the greet
  if (!bday.greeting) {
    greet = `${bday.name},
    ${greet} ${sample(BDAY_EMOJIS)}
    `;
  }

  return { greet, sticker };
}
