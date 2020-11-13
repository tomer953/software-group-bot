import axios from 'axios';
import { BotSchedulars, initSchedulars } from '../controllers/schedulars.controller';
// return true if today is SAT or FRI
export function isWeekend(): boolean {
    let now = new Date();
    return (now.getDay() == 5 || now.getDay() == 6);
}

// try to get israel GMT time from api, fallback to .env setting, fallback to 3
export async function getGMT(): Promise<number> {
    let GMT = +(process.env.GMT || 3)
    try {
        let res = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Jerusalem');
        let data = res.data;
        // data.utc_offset is: "+02:00", convert to number
        GMT = +(data.utc_offset.substr(0, 3));
        return GMT;
    } catch (error) {
        console.log(error);
        return GMT;
    }
}

// every day check if GMT has changed, if so, start all schedulars again
export async function checkForGMTChanges() {
    console.log('check if GMT time has changed');
    let newGMT = await getGMT();
    if (newGMT != BotSchedulars.GMT) {
        console.log(`GMT has changed from ${BotSchedulars.GMT} to ${newGMT}. init schedulars again`);
        initSchedulars();
    }
}