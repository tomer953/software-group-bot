import moment from 'moment';

import { BirthdayModel } from './../models/birthday.model';
import { bot } from '../index';
import { Context, MiddlewareFn, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { random } from '../helpers/random';
import { Config } from '../config/config';
import { CustomContext } from '../models/context.interface';

// group id to send the bday message
let groupId = Config.GROUP_CHAT_ID;

export const addBirthdayMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  let scene: SceneContext<any> = (<any>ctx).scene;
  await scene.enter('birthday_wizard');
};

export async function birthdaySchedular() {
  try {
    console.log('looking for birthdays...');
    let bdays = await BirthdayModel.find();

    for (const bday of bdays) {
      let momentBirthday = moment(bday.birthday, 'DD-MM-YYYY');
      if (isTodayBirthday(momentBirthday)) {
        // send happy birthday msg + sticker
        let greet = getGreetingMessage(bday);
        await bot.telegram.sendMessage(groupId, greet);
        let sticker = bday.name == 'master_tomer' ? masterSticker : random(stickers);
        await bot.telegram.sendSticker(groupId, sticker);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const greets = [
  'מזל טוב עד 120',
  'יום הולדת שמח!',
  'מזל טוב ליום הולדתך',
  'מזל טוב! לא לשכוח להביא כיבוד',
  'מזל טוב! מקווה שאתה בדרך עם הכיבוד',
  'חשבת שאני אשכח? מזל טוב ליום ההולדת!',
];

const emojis = ['🎈', '😍', '🍰', '🥳', '🎂', '😊', '👏'];
const stickers = [
  'CAACAgIAAxkBAAINcF7JNH_4f9bjpKfykA00dIBEmpbsAAIUAAOAQrscef3dUpFA6JMZBA', // SeaKingdom
  'CAACAgIAAxkBAAINcV7JNLyMKJ6zZ6Tbmg40tCat1wKhAAIdAAOvxlEaXI764QrPb7wZBA', // Snail
  'CAACAgIAAxkBAAINcl7JNNlcQA3pDOJMZm7EapAiTtfTAAJOAANEDc8XGXNMdGcpnIcZBA', // Orangino
  'CAACAgIAAxkBAAINgV7JOJSlBXl9PspRD5-GRpOuf-bwAALRAAP3AsgPsNUWIvohscwZBA', // GreenLezard
  'CAACAgIAAxkBAAINdF7JNQwVNpQXV40UzhGZYCBr8ngtAAI7AAPRYSgLXdLS1ytBP50ZBA', // GagikTheDuck
  'CAACAgIAAxkBAAINe17JNehNT76aqbGM-0YDSZg8tw7nAAJDBQACP5XMCp-FI9tmeco8GQQ', // MrCaterpillar
  'CAACAgIAAxkBAAINfF7JNggoIvApUmSXeIrF0iK95HS5AAIPAwACusCVBVPH5VmM0hyyGQQ', // KoalaBear
  'CAACAgIAAxkBAAINfV7JNjPAMY42GBYMbTRz7k-3v1K4AAL5AQACygMGC77AxM_ztKG6GQQ', // FredThePug
  'CAACAgEAAxkBAAINfl7JNkvRhaMKMzN7bmnR8BUsdlkuAAIlAAM4DoIRWlSL7ThZeAUZBA', // MintyZebra
  'CAACAgIAAxkBAAINf17JNo8grwmoKM23OqzWr12Mq6ijAAJdAQACFkJrClEqo1WBBrUdGQQ', // SweetyStrawberry
  'CAACAgIAAxkBAAEai9Nf6dJMN0YDjkbd9jBHsQ2RuocfigACpwADO2AkFO1Zfh42qVroHgQ', // LamaProblama
  'CAACAgIAAxkBAAEai9tf6dKfCS0McvvBE2W_H1MFLJZsQQACNwEAAlKJkSPVFECnfG0SGh4E', // Orangoutang
  'CAACAgIAAxkBAAEai-Nf6dMCH4Bc8GBhAZkHNIdIo6RULwACLQAD8NhFFk3hEzlwu14UHgQ', // Cupman
  'CAACAgIAAxkBAAEai-pf6dMoPQrh1DGlyd4S4mkksOlx1QAC9AADwZGyJCWYXOxpJn6oHgQ', // GoodBoy
  'CAACAgIAAxkBAAEai-9f6dNEfI8iw5mPqnd764BRAjrY0AACCwEAAvcCyA_F9DuYlapx2x4E', // Buddy_Bear
  'CAACAgIAAxkBAAEai_Jf6dNhkx8wir5sgmlt0Qaoaxy54gACZQQAApzW5wq6X_Zb0mSjiB4E', // MooingCow
  'CAACAgIAAxkBAAEai_hf6dON73eJCWKgzFUbTZUeXOLxdgACcAADDbbSGfNwXQUmdM0XHgQ', // JackTheParrot
  'CAACAgIAAxkBAAEai_1f6dPB22W-HOGywZ1xIInUZeSolAACTAEAAjDUnRH33m9fN4M5HB4E', // TheMoomintroll
  'CAACAgIAAxkBAAEajAJf6dPrO2Rm_F1EcbV9NBWQlLJ1BAACdwUAAj-VzApljNMsSkHZTh4', // MiaBunny
  'CAACAgIAAxkBAAEajApf6dQaW6FmGgRUjA-DrYIFaxQVlgAC8QAD9wLID6cr0xBOAAF4Rx4E', // HomeElectronics
  'CAACAgEAAxkBAAEkdatg0YBUVUgSmK229etg2dEMkhePRQACOgEAAlPMkEfITpc2CBnS8R8E', // SpottyGiraffe (https://t.me/addstickers/SpottyGiraffe)
  'CAACAgIAAxkBAAEkdbJg0YCQiyk9vtz174-gBdBe0jN0EwACswADMNSdET9j0fISlCKpHwQ', // MonkeyMix (https://t.me/addstickers/MonkeyMix)
  'CAACAgIAAxkBAAEkdb1g0YEvMTinhnDt2_BkCY9LKL2IOwACQQADKA9qFPDp0yN1HEZhHwQ', // Cat2O (https://t.me/addstickers/Cat2O)
];

const masterSticker = 'CAACAgIAAxkBAAFJfgtiYAOKMOrppUJg4NEpFSybcA_GWwACcBAAAmrAuEv8d779CvyIIyQE'; // SquidGame (https://t.me/addstickers/SquidGame)

function getGreetingMessage(bday: any) {
  if (bday.name == 'master_tomer') {
    return `Happy birthday to my master, sensei, mentor, owner, admin and creator.
        old age: 11111 (binary)
        new age: 2^5
        Happy b-day t0m3r!
        `;
  }
  let greet = random(greets);
  if (bday.gender == 'female') {
    greet = greet.replace(/אתה/g, 'את');
  }
  return `${bday.name},
    ${greet} ${random(emojis)}
    `;
}

// check if has same day/month (but not same year)
function isTodayBirthday(dateToCheck: moment.Moment) {
  let now = moment();
  if (now.date() == dateToCheck.date() && now.month() == dateToCheck.month()) {
    return true;
  }
  return false;
}
