import { bot } from '../index';
import axios from 'axios';
import cheerio from 'cheerio';
import { Context } from 'telegraf';
import { stripIndents } from 'common-tags';

let groupId = process.env.GROUP_CHAT_ID || '';

export async function getShabatMiddleware(ctx: Context, next: () => Promise<void>) {
  try {
    let result = await getShabatTimes();

    let msg = stripIndents`* זמני כניסת שבת בחיפה *

        ${result.description}
        * כניסת שבת: * ${result.enter}
        * יציאת שבת: * ${result.exit}
            
        שבת שלום 🕯🕯`;

    return ctx.reply(msg, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('סליחה אבל אין לי איך לעזור לך כרגע... 🤐');
    console.log(error);
  }
}

async function getShabatTimes(): Promise<any> {
  try {
    let res = await axios.get('https://www.kipa.co.il/%D7%9B%D7%A0%D7%99%D7%A1%D7%AA-%D7%A9%D7%91%D7%AA/%D7%97%D7%99%D7%A4%D7%94');
    let data = res.data;
    const $ = cheerio.load(data);

    // get rank
    let title = $('.textim').children('p').first().text();
    let times = $('.textim').children('.row').first().find('p').text();

    let description = title.replace('לרשותכם זמני הדלקת נרות וכניסת השבת בחיפה, עבור פרשת', 'פרשת');
    let enter = times.split(' ')[1].substr(4, 5);
    let exit = times.split(' ')[3];

    let result: any = {
      description,
      enter,
      exit,
    };

    return Promise.resolve(result);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export async function shabatSchedular() {
  try {
    console.log('checking shabat times...');
    let result = await getShabatTimes();

    let msg = stripIndents`* זמני כניסת שבת בחיפה *

        ${result.description}
        * כניסת שבת: * ${result.enter}
        * יציאת שבת: * ${result.exit}
            
        שבת שלום 🕯🕯`;

    await bot.telegram.sendMessage(groupId, msg, { parse_mode: 'Markdown' });
  } catch (error) {
    console.log(error);
  }
}
