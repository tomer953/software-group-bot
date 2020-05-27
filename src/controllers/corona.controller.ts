
import axios from 'axios';
import { Markup, Context } from 'telegraf';
import { CoronaCountryData, CoronaStatisticsResponse } from '../models/corona.model';

let countries: CoronaCountryData[];
let X_RAPIDAPI_KEY = process.env.X_RAPIDAPI_KEY || "";

export async function getCoronaMiddleware(ctx: Context, next: () => Promise<void>) {
    try {
        if (!countries) {
            await updateCoronaCountries();
        }

        if (ctx.message?.text) {
            let args = ctx.message.text.split(' ');
            // has argument, send country
            if (args.length > 1) {
                console.log('run with arg: /corona ' + args[1]);
                let country = args[1];
                let findCountry = countries.find(c => c.country.toLowerCase() == country.toLowerCase());
                if (findCountry) {
                    ctx.reply(getCoronaDataMessage(findCountry));
                } else {
                    ctx.reply("לא נמצאו תוצאות התואמות את החיפוש");
                }
            }
            // no arguments, send keyboard
            else {
                let keyboard = getKeyboardByPage(0);
                ctx.reply('נתוני קורונה 🦠:', keyboard.extra());
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function getCoronaDataMessage(country: CoronaCountryData) {

    let msg = country.country + " נתוני קורונה על 🦠" + "\r\n\r\n";
    msg += "סה\"כ מקרים:\t" + numberWithCommas(country.cases.total) + "\r\n";
    if (country.cases.active) {
        msg += "חולים פעילים:\t" + numberWithCommas(country.cases.active) + "\r\n";
    }
    if (country.cases.new) {
        msg += "מקרים חדשים:\t" + country.cases.new + "\r\n";
    }
    msg += "מקרי מוות:\t" + numberWithCommas(country.deaths.total) + "\r\n";
    if (country.deaths.new) {
        msg += "מקרי מוות חדשים:\t" + country.deaths.new + "\r\n";
    }
    msg += "במצב חמור:\t" + numberWithCommas(country.cases.critical) + "\r\n";
    msg += "מחלימים:\t" + numberWithCommas(country.cases.recovered) + "\r\n";

    let deathPer = 0;
    deathPer = country.deaths.total * 100 / country.cases.total;
    if (deathPer > 0) {
        msg += "אחוז תמותה:\t" + deathPer.toFixed(2) + "%\r\n";
    }
    return msg;
}

// update countries list from api
export async function updateCoronaCountries(): Promise<CoronaCountryData[]> {
    try {
        let response = await axios({
            "method": "GET",
            "url": "https://covid-193.p.rapidapi.com/statistics",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "x-rapidapi-key": X_RAPIDAPI_KEY,
                "useQueryString": true
            }
        });
        let data: CoronaStatisticsResponse = response.data;

        if (!data) {
            throw new Error('no data');
        }

        let _countries = data.response;
        _countries.sort((a, b) => b.cases.total - a.cases.total) // sort by total cases;

        // ignore some results
        let ignore = [
            "Europe",
            "North-America",
            "Asia",
            "South-America",
            "Africa",
            "Oceania"
        ];
        _countries = _countries.filter(c => !ignore.includes(c.country));
        // update static list
        countries = _countries;
        return Promise.resolve(countries);


    } catch (error) {
        console.log(error);
        return Promise.reject();
    }
}

export async function changeCoronaPageHandler(ctx: Context, next: () => Promise<void>) {

    try {
        if (!countries) {
            await updateCoronaCountries();
        }
        if (ctx.match) {
            let pageId: number = +ctx.match[1];
            let keyboard = getKeyboardByPage(pageId);
            ctx.editMessageReplyMarkup(keyboard);
        }
        ctx.answerCbQuery();
    } catch (error) {
        console.log(error);
    }
}

export async function sendCoronaDataHandler(ctx: Context, next: () => Promise<void>) {

    if (!countries) {
        await updateCoronaCountries();
    }
    if (ctx.match) {
        let country = ctx.match[1];
        let findCountry = countries.find(c => c.country.toLowerCase() == country.toLowerCase());
        if (findCountry) {
            let msg = getCoronaDataMessage(findCountry);
            ctx.reply(msg);
        }
        ctx.answerCbQuery();
    }
}

function getKeyboardByPage(pageId: number) {
    let totalItems = 5;
    let itemsPerRow = 1;
    let rows = [];
    let row = [];
    let navRow = [];

    // calc pagination loop
    let i;
    for (i = pageId * totalItems; i < countries.length && i < (pageId + 1) * totalItems; i++) {
        const cData = countries[i];

        // add button to a row
        if (cData.cases) {
            let total = cData.cases.total;
            let number = i + ".";
            if (i == 0) {
                number = "🌎";
            }
            row.push(Markup.callbackButton(`${number} ${cData.country} - ${numberWithCommas(total)}`, "CORONA:DATA:" + cData.country));
        }

        // every "itemsPerRow" items
        if ((i + 1) % itemsPerRow == 0) {
            rows.push(row); // add prev row to the matrix
            row = [];       // create new row
        }
    }

    // add last row
    if (row.length) {
        rows.push(row);
    }

    // add navigation buttons
    // show next button
    if (i < countries.length) {
        let nextButton = Markup.callbackButton("הבא ⬅️", "CORONA:NAV:" + (pageId + 1));
        navRow.push(nextButton);
    }
    // show prev button
    if (pageId > 0) {
        let prevButton = Markup.callbackButton("➡️ הקודם", "CORONA:NAV:" + (pageId - 1));
        navRow.push(prevButton);
    }

    rows.push(navRow);
    return Markup.inlineKeyboard(rows);
}

// convert 12345 to 12,345
function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}