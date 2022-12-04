import { MiddlewareFn } from 'telegraf';

import { bot } from '../index';
import { isWeekend } from '../helpers/dates';
import quotes from '../assets/quotes.json';
import { random } from '../helpers/random';
import { CustomContext } from '../models/context.interface';
import { Config } from '../config/config';

let { ENABLE_QUOTES, GROUP_CHAT_ID } = Config;

// command: /quote
// result: send random quote
export const getQuoteMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  try {
    let quote = await getQuote();
    let msg = `💡 ציטוט אקראי:\n
        "${quote.quote}"`;
    if (quote.author) {
      msg += `\n(${quote.author})`;
    }
    return ctx.reply(msg);
  } catch (error) {
    ctx.reply('מצטער, אין לי משהו חכם לומר כרגע 🤐');
    console.log(error);
  }
};

// command: /toogle_quotes
// result: toggle daily quotes on/off
export const toggleQuotesMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  try {
    ENABLE_QUOTES = !ENABLE_QUOTES;
    let reply = 'הציטוט השבועי עכשיו ';
    reply += ENABLE_QUOTES ? 'דלוק ✅' : 'כבוי ❌';
    return ctx.reply(reply);
  } catch (error) {
    console.log(error);
  }
};

export async function quoteSchedular() {
  try {
    // ignore if weekend, or if quotes disabled
    if (isWeekend() || !ENABLE_QUOTES) {
      return;
    }
    let quote = await getQuote();
    let msg = `💡 הציטוט השבועי:\n
        "${quote.quote}"`;
    if (quote.author) {
      msg += `\n(${quote.author})`;
    }
    await bot.telegram.sendMessage(GROUP_CHAT_ID, msg);
  } catch (error) {
    console.log(error);
  }
}

export interface Quote {
  rank?: string;
  quote?: string;
  author?: string;
}

async function getQuote(): Promise<Quote> {
  let quote: Quote = random(quotes);
  return quote;
}

// async function getQuote(): Promise<Quote> {
//     try {
//         let tries = 5;
//         while (tries) {

//             let res = await axios.get('http://www.pitgam.net/random.php?t=1');
//             let data = res.data;
//             const root = parse(data);

//             let quote: Quote = {};

//             // get rank
//             let mediaRank = (<any>root).querySelector('.media-rank');
//             quote.rank = (mediaRank.childNodes[3].rawText).trim();

//             if (quote.rank && +(quote.rank) > 9.2) {

//                 // get body
//                 let mediaBody = (<any>root).querySelector('.media-body');
//                 if (mediaBody.childNodes?.length) {
//                     quote.quote = mediaBody.childNodes[1].rawText;
//                 }
//                 // get author
//                 let authorElement = (<any>root).querySelector('.media-attributed a');
//                 quote.author = authorElement.rawText;
//                 return Promise.resolve(quote);

//             } else {
//                 console.log('bad quote..', quote.rank);
//                 tries--;
//                 continue;
//             }
//         }

//         return Promise.reject('not found')

//     } catch (error) {
//         console.log(error);
//         return Promise.reject(error);
//     }
// }
