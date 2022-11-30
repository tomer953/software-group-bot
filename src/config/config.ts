import { config } from "dotenv";
config(); // read from .env file, insert to process.env

export class Config {
  /**
   * node environment
   * @example 'local' | 'production'
   * @default 'local'
   */
  public static NODE_ENV = process.env.NODE_ENV || "local";

  /**
   * express port
   * @default 3000
   */
  public static PORT = +process.env.PORT || 3000;

  /**
   * Mongodb url
   * @example mongodb://localhost:27017/sample_db
   */
  public static DB_URL = process.env.DB_URL;

  /**
   * The hostname of the bot api
   * @example https://xxx.azuredevops.microsoft.net
   */
  public static HOST_URL = process.env.HOST_URL;

  /**
   * telegram bot token (from botfather)
   */
  public static BOT_TOKEN = process.env.BOT_TOKEN;

  /**
   * number of GMT offset
   */
  public static GMT = parseInt(process.env.GMT);

  /**
   * Telegram group chat id
   */
  public static GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;
}
