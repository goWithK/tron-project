import { Bot, Context, SessionFlavor } from 'grammy';
import {
    type Conversation,
    type ConversationFlavor,
} from '@grammyjs/conversations';
import { type EmojiFlavor } from '@grammyjs/emoji';
import { ParseModeFlavor } from '@grammyjs/parse-mode';

interface SessionData {
    itemLevel: string;
    isDEGANft: boolean;
}
export type MyContext = EmojiFlavor<Context>;
export type SessionContext = Context & SessionFlavor<SessionData>;
export type BotContext = SessionContext & ConversationFlavor & MyContext;
export type ConverstaionContext = Conversation<BotContext>;


export interface IBotCommand {
    registerStartCommand(bot: Bot<ParseModeFlavor<BotContext>>): void;
    registerStopCommand(bot: Bot<ParseModeFlavor<BotContext>>): void;
    registerHelpCommand(bot: Bot<ParseModeFlavor<BotContext>>): void;

    executeStartCommand(bot: Bot<ParseModeFlavor<BotContext>>, ctx: any): Promise<void>;
}

export enum BotType {
    Lock = 'lock_bot'
}

export interface IDataPool {
    renounced: Promise<boolean>;
    transactionInput: Promise<string>;
    lockInfo: Promise<any>;
    pairAddress: Promise<string>;
    deployerAddress: Promise<string>;
    exchange: Promise<string>;
    contractAddress: Promise<string>;
    lockPercent: Promise<number>;
    lockDays: Promise<number>;
    tokenName: Promise<string>;
    tokenSymbol: Promise<string>;
    tokenDecimal: Promise<number>;
    tokenTotalSupply: Promise<number>;
    totalHolders: Promise<number>;
    topHolders: Promise<{[index: string]: any}>;
    initialLp: Promise<number>;
    totalTxns: Promise<number>;
    priceToken: Promise<number>;
    liquidity: Promise<number>;
    liveTime: Promise<string>;
    marketCapLock: Promise<number>;
    deployerBalance: Promise<number>;
    verified: Promise<boolean>;
    clog: Promise<string>;
}

export interface IDataPoolScanner {
    contractAddress: Promise<string>;
    deployerAddress: Promise<string>;
    pairAddress: Promise<string>;
    tokenName: Promise<string>;
    tokenSymbol: Promise<string>;
    tokenDecimal: Promise<number>;
    tokenTotalSupply: Promise<number>;
    totalHold: Promise<number>;
    holderPercs: Promise<{ [index: string]: string }>;
}
