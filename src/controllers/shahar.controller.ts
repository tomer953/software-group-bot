import { Config } from '../config/config';
import { bot } from '../index';

const GROUP_CHAT_ID = Config.GROUP_CHAT_ID;

export async function shaharSchedular() {
  try {
    let d = new Date();
    // skip weekend (friday and saturday)
    if (d.getDate() == 1 && d.getDay() > 4) {
      return;
    }
    // if we skipped the weekend, send in the next sunday instead
    if ((d.getDate() == 2 || d.getDate() == 3) && d.getDay() != 0) {
      return;
    }

    let msg = `💡 * תזכורת - לא לשכוח לסגור שחר *`;
    await bot.telegram.sendMessage(GROUP_CHAT_ID, msg, { parse_mode: 'Markdown' });
  } catch (error) {
    console.log(error);
  }
}
