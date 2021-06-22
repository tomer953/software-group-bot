import { bot } from '../index';
let groupId = process.env.GROUP_CHAT_ID || "";
export async function shaharSchedular() {
    try {

        let msg = `💡 * תזכורת - לא לשכוח לסגור שחר *`;
        await bot.telegram.sendMessage(groupId, msg, { parse_mode: 'Markdown' });

    } catch (error) {
        console.log(error);
    }
}