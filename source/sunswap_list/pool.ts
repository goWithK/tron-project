import Web3 from "web3";
import { TronScanAPI } from "../shared/apis/tronscan.api";
///<reference types="@types/tronweb" />
import TronWeb from 'tronweb';
import { IDataPoolScanner } from "../shared/type";
import { underline } from "@grammyjs/parse-mode";

export class ScannerDataPool implements IDataPoolScanner {

    private _web3;

    private _transactionHash: string;
    private _contractAddress: string;
    private _deployerAddress: string;
    private _pairAddress: string;
    private _tokenName: string;
    private _tokenSymbol: string;
    private _tokenDecimal: number;
    private _tokenTotalSupply: number;
    private _totalHold: number = 0;
    private _holderPercs: { [index: string]: string };
    private _contractInfo: any;
    private _tokenInfo: any;
    private _holderInfo: any;

    public constructor(transactionHash: string, contractAddress: string, pairAddress: string, tokenDecimal: number) {

        this._web3 = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            //headers: { "TRON-PRO-API-KEY": tronScanKey },
        });

        this._transactionHash = transactionHash;
        this._contractAddress = contractAddress;
        this._pairAddress = pairAddress;
        this._tokenDecimal = tokenDecimal;
    }

    public get pairAddress(): Promise<string> {
        return (async () => {
            return this._pairAddress
        })();
    }

    public get deployerAddress(): Promise<string> {
        return (async () => {
            if (this._deployerAddress) {
                return this._deployerAddress
            }

            await this._fulFillContractInfo();
            this._deployerAddress = this._contractInfo?.data[0]?.creator?.address;

            return this._deployerAddress
        })();
    }

    public get contractAddress(): Promise<string> {
        return (async () => {

            return this._contractAddress
        })();
    }

    public get tokenName(): Promise<string> {
        return (async () => {
            if (this._tokenName) {
                return this._tokenName
            }

            await this._fullFillTokenInfo();
            this._tokenName = this._tokenInfo?.trc20_tokens[0]?.name;
            this._tokenSymbol = this._tokenInfo?.trc20_tokens[0]?.symbol;
            this._tokenTotalSupply = this._tokenInfo?.trc20_tokens[0]?.total_supply_with_decimals;

            return this._tokenName
        })();
    }

    public get tokenSymbol(): Promise<string> {
        return (async () => {
            if (this._tokenSymbol) {
                return this._tokenSymbol
            }

            if (this._tokenInfo) {
                this._tokenSymbol = this._tokenInfo?.trc20_tokens[0]?.symbol;
                return this._tokenSymbol
            }

            await this.tokenName;
            return this._tokenSymbol
        })();
    }

    public get tokenDecimal(): Promise<number> {
        return (async () => {

            return this._tokenDecimal
        })();
    }

    public get tokenTotalSupply(): Promise<number> {
        return (async () => {
            if (this._tokenTotalSupply) {
                return this._tokenTotalSupply
            }

            if (this._tokenInfo) {
                this._tokenTotalSupply = this._tokenInfo?.trc20_tokens[0]?.total_supply_with_decimals;
                return this._tokenTotalSupply
            }

            await this.tokenName;
            return this._tokenTotalSupply
        })();
    }

    public get totalHold(): Promise<number> {
        return (async () => {
            if (this._totalHold) {
                return this._totalHold
            }

            await this._fullFillHolderInfo();
            const holders = this._holderInfo?.trc20_tokens;
            // console.log('--', await this.tokenTotalSupply, await this.deployerAddress, holders)
            for (let i=0; i < holders.length; i++) {
                if (holders[i]?.holder_address == await this.deployerAddress && await this.tokenTotalSupply){
                    let creatorHold = Number(holders[i]?.balance)/Number(await this.tokenTotalSupply)*100;
                    this._holderPercs[`${await this.deployerAddress} - Creator`] = creatorHold.toFixed(2);
                    this._totalHold += creatorHold;
                } else if (holders[i]?.holder_address !== await this.pairAddress && await this.tokenTotalSupply) {
                    let hold = Number(holders[i]?.balance)/Number(await this.tokenTotalSupply)*100;
                    this._holderPercs[holders[i]?.holder_address] = hold.toFixed(2);
                    this._totalHold += hold;
                } 
            }

            return this._totalHold
        })()
    }

    public get holderPercs(): Promise<any> {
        return (async () => {
            if (this._holderPercs) {
                return this._holderPercs
            }

            if (this._holderInfo) {
                return this._tokenTotalSupply
            }
            
            await this.totalHold;
            return this._holderPercs
        })()
    }

    private async _fulFillContractInfo(): Promise<void> {
        console.log('Fill Contract Information for txn', this._transactionHash)
        this._contractInfo = await TronScanAPI.getContractInfo(this._contractAddress);
    }

    private async _fullFillTokenInfo(): Promise<void> {
        console.log('Fill Token Information')
        this._tokenInfo = await TronScanAPI.getTokenInfo(this._contractAddress);
    }

    private async _fullFillHolderInfo(): Promise<void> {
        console.log('Fill Holder Information')
        this._holderInfo = await TronScanAPI.getTokenHolder(this._contractAddress);
    }

}
