// import { LockBot } from "./source/lock_bot/bot";
import TelegramBot from './source/shared/bot';
import { DeployBotHandler } from './source/sunswap_list/handler';
import * as dotenv from 'dotenv';
dotenv.config();

const runApp = async () => {
    try {
        const commandHandler = new DeployBotHandler();
        const bot = new TelegramBot(commandHandler, process.env.BOT_KEY ? process.env.BOT_KEY : '');
        bot.run();

    } catch (error: any) {
        console.log(`${error.stack.toString()}`)
    }
};

runApp();
