import Web3 from "web3";
import { TronScanAPI } from "../shared/apis/tronscan.api";
///<reference types="@types/tronweb" />
import TronWeb from 'tronweb';
import { Message } from "./message";
import { TimeHelper } from "../shared/helpers/time.helper";
import {getTokenName, getTokenSymbol, getTokenDecimal, getTokenSupply, getCreateTokenTxn, getInitialBought} from "../shared/helpers/utils"
import { BotContext, IBotCommand } from "../shared/type";
import { Bot } from "grammy";
import { ParseModeFlavor } from "@grammyjs/parse-mode";
import { ScannerDataPool } from "./pool";


export class DeployBotHandler implements IBotCommand {

    private _web3: TronWeb;

    public constructor() {
        this._web3 = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            //headers: { "TRON-PRO-API-KEY": tronScanKey },
        });
    }

    public registerStartCommand(bot: Bot<ParseModeFlavor<BotContext>>): void {
        bot.command('start', async (ctx: any) => {
            this.executeStartCommand(bot, ctx);
        });
    }

    public async executeStartCommand(bot: Bot<ParseModeFlavor<BotContext>>, ctx: any): Promise<void> {
        console.log('Tron Bot IS RUNNING');
        const chatId = process.env.CHAT_ID;
        var previousAddress: string = "";
        const wtrxAddress = "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR";

        while (true) {
            try {
                await TimeHelper.delay(1);
                const resp =  await this._web3.getEventResult(
                    "TKWJdrQkqHisa1X8HUdHEfREvTzw4pMAaY",
                    {eventName:"PairCreated",size:1}
                )
                // console.log(resp)
                var contractAddress: string = this._web3.address.fromHex(resp[0]?.result['0']);
                if (contractAddress === wtrxAddress) {
                    contractAddress = this._web3.address.fromHex(resp[0]?.result['1']);
                }
                //console.log(contractAddress, previousAddress) //
                if (contractAddress !== previousAddress) {
                    previousAddress = contractAddress
                    await this._startSendingMessages(chatId, ctx, bot, contractAddress, resp);
                }
                
            }
            catch (e) {
                console.error(e);
                continue
            }
        }

    }

    public registerHelpCommand(bot: Bot<ParseModeFlavor<BotContext>>): void {
        bot.command('help', async (ctx: any) => {
            const chatId = ctx.msg.chat.id;

            await bot.api.sendMessage(
                chatId,
                'Help',
                { parse_mode: "HTML" },
            );
        });
    }

    public registerStopCommand(bot: Bot<ParseModeFlavor<BotContext>>): void {
        bot.command("stop", async (ctx: any) => {
            await ctx.reply("Leaving...");
        });
    }

    private async _startSendingMessages(chatId: any, ctx: any, bot: any, contractAddress: string, resp: any): Promise<void> {    
        const pairAddress = this._web3.address.fromHex(resp[0]?.result['2']);
        const txnHash = resp[0]?.transaction;

        const tokenName = await getTokenName(contractAddress);
        const tokenSymbol = await getTokenSymbol(contractAddress);
        const tokenSupply = await getTokenSupply(contractAddress);
        const tokenDecimal = await getTokenDecimal(contractAddress);
        if (tokenName) {
            // const dataPool = new ScannerDataPool(txnHash, contractAddress, pairAddress, tokenDecimal);
            // const message = new Message(dataPool, ctx);
            // const msgContent = await message.getMsgContent();

            const contractInfo = await TronScanAPI.getContractInfo(contractAddress)
            const devAddress = contractInfo?.data[0]?.creator?.address;
            const createdTime = contractInfo?.data[0]?.date_created;

            //get initial bought
            const transactions = await TronScanAPI.getTxByAddress(devAddress);
            const transactionsData = transactions?.data;
            const createTxn = await getCreateTokenTxn(transactionsData);
            const initialBought = await getInitialBought(createTxn, devAddress, contractAddress)
            const initialBoughtPerc = (initialBought['amount_in_token']*100/tokenSupply).toFixed(2)

            const holderData = await TronScanAPI.getTokenHolder(contractAddress);
            const holders = holderData?.trc20_tokens;
            var holderPercs: any = {};
            var totalHolds: number = 0;

            for (let i=0; i < holders.length; i++) {
                if (holders[i]?.holder_address == devAddress){
                    let creatorHold = Number(holders[i]?.balance)/Number(tokenSupply)*100;
                    holderPercs[`${devAddress} - Creator`] = `Creator - ${creatorHold.toFixed(2)}`;
                    totalHolds += creatorHold;
                } else if (holders[i]?.holder_address !== pairAddress) {
                    let hold = Number(holders[i]?.balance)/Number(tokenSupply)*100;
                    holderPercs[holders[i]?.holder_address] = hold.toFixed(2);
                    totalHolds += hold;
                } 
            }

            //Name + Symbol
            let title = ctx.emoji`${"bullseye"}<a href="https://tronscan.org/#/token20/${contractAddress}">${tokenName} | ${tokenSymbol}</a>\n\n`
            //CA
            let line1msg = ctx.emoji`${"money_bag"} <b>CA:</b> <code>${contractAddress}</code> \n\n`;
            //Dev Stats
            let line2msg = `<b>Dev Address:</b> <code>${devAddress}</code> \n` 
                            + `<b>Dev Bought: ${initialBought['amount_in_trx']} (${initialBoughtPerc}%)</b> \n\n`;
            //Total Hold
            let line3msg = `<b>Top 10 hold:</b> ${totalHolds.toFixed(2)}%\n`;
            //Each holder
            let list_msg: any = [];
            let holderAddress: any = Object.keys(holderPercs);
            for (let i = 0; i < holderAddress.length; i++) {
                list_msg.push(`${holderPercs[holderAddress[i]]}%`)
            }
            let line4msg = '<b>Holders:</b> \n' + list_msg.join(' | ')
            
            let msgContent = title + line1msg + line2msg + line3msg + line4msg;
            if (msgContent != '') {
                await bot.api.sendMessage(
                    chatId,
                    msgContent,
                    { parse_mode: "HTML" },
                );
            } else {
                console.log(`Error at transaction: ${resp[0]?.transaction}`)
            }
        }
    }
}