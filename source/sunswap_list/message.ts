// Used to build & send Telegram Message
import { formatter } from '../shared/helpers/utils';
import { IDataPoolScanner } from '../shared/type';

export class Message {


    private _dataPool: IDataPoolScanner;
    private _ctx: any;

    public constructor(dataPool: IDataPoolScanner, ctx: any) {
        this._dataPool = dataPool;
        this._ctx = ctx
    }

    public async getMsgContent(): Promise<string> {
        console.log('Start gathering message info')
        const tokenName = await this._dataPool.tokenName;
        const tokenSymbol = await this._dataPool.tokenSymbol;
        if (tokenSymbol !== undefined) {
            const contractAddress = await this._dataPool.contractAddress;
            const devAddress = await this._dataPool.deployerAddress;
            const totalHold = await this._dataPool.totalHold;
            const holderPercs = await this._dataPool.holderPercs;

            console.log('Finish gathering snipe message info')
            //Name + Symbol
            let title = this._ctx.emoji`${"bullseye"}<a href="https://tronscan.org/#/token20/${contractAddress}">${tokenName} | ${tokenSymbol}</a>\n\n`
            //CA
            let line1msg = this._ctx.emoji`${"money_bag"} <b>CA:</b> <code>${contractAddress}</code> \n\n`;
            //Total Hold
            let line2msg = `<b>Top 10 hold:</b> ${totalHold.toFixed(2)}%\n`;
            //Each holder
            let list_msg: any = [];
            let holderAddress: any = Object.keys(holderPercs);
            for (let i = 0; i < holderAddress.length; i++) {
                list_msg.push(`${holderAddress[i]} - ${holderPercs[holderAddress[i]]}%`)
            }
            let line3msg = '<b>Holders:</b> \n' + list_msg.join('\n')
            
            let tg_msg = title + line1msg + line2msg + line3msg;

            return tg_msg
        }
        return ''
    }
}
