import axios from 'axios';
import { Context } from 'telegraf';

const URL = process.env.URL || '';

export async function pingMiddleware(ctx: Context, next: () => Promise<void>) {
  try {
    let user: any = (<any>ctx).user;
    ctx.reply(user.first_name + ', pong!');
  } catch (error) {
    console.log(error);
  }
}

export async function pingHeroku() {
  try {
    await axios.get(URL);
  } catch (error) {
    // ignore error from the ping
  }
}
