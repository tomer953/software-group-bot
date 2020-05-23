import { TelegrafContext } from "telegraf/typings/context";
import axios from 'axios';
import { parse } from 'node-html-parser';
import { bot } from '../index';

let groupId = process.env.GROUP_CHAT_ID || "";

export async function getQuoteMiddleware(ctx: TelegrafContext, next: () => Promise<void>) {
    try {
        let quote = await getQuote();
        let msg = `💡 ציטוט אקראי:\n
        "${quote.quote}"\n
        (${quote.author})`;
        console.log(ctx.message?.chat);
        return ctx.reply(msg);
    } catch (error) {
        ctx.reply('מצטער, אין לי משהו חכם לומר כרגע 🤐');
        console.log(error);
    }
}

export interface Quote {
    rank?: string;
    quote?: string;
    author?: string;
}

async function getQuote(): Promise<Quote> {
    try {
        let tries = 5;
        while (tries) {

            let res = await axios.get('http://www.pitgam.net/random.php?t=1');
            let data = res.data;
            const root = parse(data);

            let quote: Quote = {};

            // get rank
            let mediaRank = (<any>root).querySelector('.media-rank');
            quote.rank = (mediaRank.childNodes[3].rawText).trim();

            if (quote.rank && +(quote.rank) > 9.2) {

                // get body
                let mediaBody = (<any>root).querySelector('.media-body');
                if (mediaBody.childNodes?.length) {
                    quote.quote = mediaBody.childNodes[1].rawText;
                }
                // get author
                let authorElement = (<any>root).querySelector('.media-attributed a');
                quote.author = authorElement.rawText;
                return Promise.resolve(quote);

            } else {
                console.log('bad quote..', quote.rank);
                tries--;
                continue;
            }
        }

        return Promise.reject('not found')

    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function quoteSchedular() {
    try {
        let quote = await getQuote();
        let msg = `💡 הציטוט היומי:\n
        "${quote.quote}"\n
        (${quote.author})`;
        await bot.telegram.sendMessage(groupId, msg);
    } catch (error) {
        console.log(error);
    }
}