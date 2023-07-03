import { MiddlewareFn } from 'telegraf';
import { sample } from 'lodash';

import { bot } from '../index';
import { isWeekend } from '../helpers/dates';
import quotes from '../assets/quotes.json';
import { CustomContext } from '../models/context.interface';
import { Config } from '../config/config';
import { Quote } from '../models/quote.interface';

let { ENABLE_QUOTES, GROUP_CHAT_ID } = Config;

// command: /quote
// result: send random quote
export const getQuoteMiddleware: MiddlewareFn<CustomContext> = async function (ctx, next) {
  try {
    let quote = getQuote();
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

// command: /toggle_quotes
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
    let quote = getQuote();
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

function getQuote(): Quote {
  return sample(quotes);
}
