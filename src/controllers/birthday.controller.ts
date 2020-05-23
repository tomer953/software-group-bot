import { SceneContext } from 'telegraf/typings/stage';
import { TelegrafContext } from 'telegraf/typings/context';
import moment = require('moment');
import { bot } from '../index';
import { Context } from 'telegraf';
import { random } from '../helpers/random';
const Birthday = require('../models/birthday.model');

// group id to send the bday message
let groupId = process.env.GROUP_CHAT_ID || "";

export async function addBirthdayMiddleware(ctx: TelegrafContext, next: () => Promise<void>) {
    let scene: SceneContext<any> = (<any>ctx).scene;
    await scene.enter('birthday_wizard');
}

export async function birthdaySchedular() {
    try {
        let bdays = await Birthday.find();

        for (const bday of bdays) {
            let momentBirthday = moment(bday.birthday);
            if (isTodayBirthday(momentBirthday)) {

                // send happy birthday msg + sticker
                await bot.telegram.sendMessage(groupId, getGreetingMessage(bday.name));
                await bot.telegram.sendSticker(groupId, random(stickers));

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
];

const emojis = ["🎈", "😍","🍰", "🥳", "🎂", "😊", "👏"];
const stickers = [
    "CAACAgIAAxkBAAINcF7JNH_4f9bjpKfykA00dIBEmpbsAAIUAAOAQrscef3dUpFA6JMZBA", // SeaKingdom
    "CAACAgIAAxkBAAINcV7JNLyMKJ6zZ6Tbmg40tCat1wKhAAIdAAOvxlEaXI764QrPb7wZBA", // Snail
    "CAACAgIAAxkBAAINcl7JNNlcQA3pDOJMZm7EapAiTtfTAAJOAANEDc8XGXNMdGcpnIcZBA", // Orangino
    "CAACAgIAAxkBAAINgV7JOJSlBXl9PspRD5-GRpOuf-bwAALRAAP3AsgPsNUWIvohscwZBA", // GreenLezard
    "CAACAgIAAxkBAAINdF7JNQwVNpQXV40UzhGZYCBr8ngtAAI7AAPRYSgLXdLS1ytBP50ZBA", // GagikTheDuck
    "CAACAgIAAxkBAAINe17JNehNT76aqbGM-0YDSZg8tw7nAAJDBQACP5XMCp-FI9tmeco8GQQ", // MrCaterpillar
    "CAACAgIAAxkBAAINfF7JNggoIvApUmSXeIrF0iK95HS5AAIPAwACusCVBVPH5VmM0hyyGQQ", // KoalaBear
    "CAACAgIAAxkBAAINfV7JNjPAMY42GBYMbTRz7k-3v1K4AAL5AQACygMGC77AxM_ztKG6GQQ", // FredThePug
    "CAACAgEAAxkBAAINfl7JNkvRhaMKMzN7bmnR8BUsdlkuAAIlAAM4DoIRWlSL7ThZeAUZBA", // MintyZebra
    "CAACAgIAAxkBAAINf17JNo8grwmoKM23OqzWr12Mq6ijAAJdAQACFkJrClEqo1WBBrUdGQQ", // SweetyStrawberry
]

function getGreetingMessage(name: string) {
    return `${name},
    ${random(greets)} ${random(emojis)}
    `
}

// check if has same day/month (but not same year)
function isTodayBirthday(dateToCheck: moment.Moment) {
    let now = moment();
    if (now.date() == dateToCheck.date() && now.month() == dateToCheck.month()) {
        return true;
    }
    return false;
}