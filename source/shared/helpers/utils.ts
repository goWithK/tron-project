import Web3, { Bytes, eth } from 'web3';
import { ethers, lock } from 'ethers';
///<reference types="@types/tronweb" />
import TronWeb from 'tronweb';
import * as dotenv from 'dotenv';
dotenv.config();

var tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    //headers: { "TRON-PRO-API-KEY": tronScanKey },
});

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const convertSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h : ${minutes}m`
}

export async function getTokenName(address: string) {
    const nameAbi = '{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}';
    let contract = await tronWeb.contract([JSON.parse(nameAbi)], address)
    let tokenName = await contract.name().call();

    return tokenName
}

export async function getTokenSymbol(address: string) {
    const symbolAbi ='{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}';
    let contract = await tronWeb.contract([JSON.parse(symbolAbi)], address)
    let tokenSymbol = await contract.symbol().call();

    return tokenSymbol
}

export async function getTokenBalanceOf(contractAddress: string, userAddress: string) {
    const userBalanceAbi = '{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}';
    let contract = await tronWeb.contract([JSON.parse(userBalanceAbi)], contractAddress)
    let userBalance = await contract.balanceOf(userAddress).call();

    return Number(userBalance)
}

export async function getTokenSupply(address: string) {
    const tokenSupplyAbi = '{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}';
    let contract = await tronWeb.contract([JSON.parse(tokenSupplyAbi)], address)
    let tokenSupply = await contract.totalSupply().call();

    return tokenSupply
}

export async function getTokenDecimal(address: string) {
    const decimalAbi = '{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"}';
    let contract = await tronWeb.contract([JSON.parse(decimalAbi)], address)
    let tokenDecimal = await contract.decimals().call();

    return tokenDecimal
}

export async function getCreateTokenTxn(transactionData: any){
    var createTokenTxn: string = "";
    for (let i=0; i < transactionData.length; i++) {
        const eachTxn = transactionData[i];
        if (eachTxn.hasOwnProperty('raw_data')) {
            const dataHex = eachTxn?.raw_data?.contract[0]?.parameter?.value?.data;
            if (!dataHex) {
                continue
            }
            else if (dataHex.slice(0, 8).includes('2f70d762')) {
                createTokenTxn = eachTxn?.txID;
            }
        }
    }

    return createTokenTxn
}

export async function getInitialBought(createTokenTxn: string, devAddress: string, contractAddress: string) {
    const safeVaultAddress = "TG9nDZMUtC4LBmrWSdNXNi8xrKzXTMMSKT";
    const createTxn = await tronWeb.getEventByTransactionID(createTokenTxn);
    var output:{[x: string]: number}  = {};
    
    for (let i=0; i < createTxn.length; i++){
        if (createTxn[i]?.contract == safeVaultAddress && createTxn[i]?.result?.amount != '20000000'){
            output['amount_in_trx'] = Number(createTxn[i]?.result?.amount)/10000;
        }
        else if (createTxn[i]?.contract == contractAddress && createTxn[i]?.result.hasOwnProperty('1')){
            if (tronWeb.address.fromHex(createTxn[i]?.result['1']) == devAddress){
                output['amount_in_token'] = Number(createTxn[i]?.result?.value);
            }
        }
    }

    return output
}

