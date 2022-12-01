import schedule, { Job } from 'node-schedule';
import { getGMT, checkForGMTChanges } from '../helpers/dates';
import { birthdaySchedular } from './birthday.controller';
// import { updateCoronaCountries } from './corona.controller.ts.bak';
// import { quoteSchedular } from './quote.controller.ts.bak';
// import { shaharSchedular } from './shahar.controller.ts.bak';

// initialize schedulars class
export class BotSchedulars {
  public static jobs: Job[] = [];
  public static GMT: number;
}

export async function initSchedulars() {
  for (const job of BotSchedulars.jobs) {
    job.cancel();
  }
  BotSchedulars.jobs = [];
  BotSchedulars.GMT = await getGMT();
  console.log('init schedulars with GMT value: ' + BotSchedulars.GMT);
  BotSchedulars.jobs.push(schedule.scheduleJob({ hour: 7 - BotSchedulars.GMT, minute: 30 }, birthdaySchedular)); // check for birthdays
  // BotSchedulars.jobs.push(schedule.scheduleJob({ dayOfWeek: 4, hour: 13 - BotSchedulars.GMT, minute: 0 }, quoteSchedular)); // send weekly quote
  // BotSchedulars.jobs.push(schedule.scheduleJob({ date: 1, hour: 9 - BotSchedulars.GMT, minute: 0 }, shaharSchedular)); // send SHAHAR reminder
  // BotSchedulars.jobs.push(schedule.scheduleJob({ date: 2, hour: 9 - BotSchedulars.GMT, minute: 0 }, shaharSchedular)); // send SHAHAR reminder
  // BotSchedulars.jobs.push(schedule.scheduleJob({ date: 3, hour: 9 - BotSchedulars.GMT, minute: 0 }, shaharSchedular)); // send SHAHAR reminder
  // BotSchedulars.jobs.push(schedule.scheduleJob('*/10 * * * *', updateCoronaCountries)); // update corona data every 10 minutes
  BotSchedulars.jobs.push(schedule.scheduleJob({ hour: 5 - BotSchedulars.GMT, minute: 0 }, checkForGMTChanges)); // check for GMT changes
}
