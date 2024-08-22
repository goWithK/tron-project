export class TronScanAPI {
    public static async getTxnInfo(txnHash: string){
        const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${txnHash}`
    
        const resp = await fetch(url, {
            headers: {
              'TRON-PRO-API-KEY': process.env.API_TRONSCAN_KEY_1!
            }
          })
        return resp.json();
    }
    
    public static async getContractInfo(address: string){
        const url = `https://apilist.tronscanapi.com/api/contract?contract=${address}`
    
        const resp = await fetch(url, {
            headers: {
              'TRON-PRO-API-KEY': process.env.API_TRONSCAN_KEY_1!
            }
          })
        return resp.json();
    }
    
    public static async getTokenInfo(address: string){
        const url = `https://apilist.tronscanapi.com/api/token_trc20?contract=${address}&showAll=1&start=&limit=`
    
        const resp = await fetch(url, {
            headers: {
              'TRON-PRO-API-KEY': process.env.API_TRONSCAN_KEY_1!
            }
          })
        return resp.json();
    }
    
    public static async getTokenHolder(address: string, limit:number = 11){
        const url = `https://apilist.tronscanapi.com/api/token_trc20/holders?start=0&limit=${limit}&contract_address=${address}&holder_address=`
    
        const resp = await fetch(url, {
            headers: {
              'TRON-PRO-API-KEY': process.env.API_TRONSCAN_KEY_1!
            }
          })
        return resp.json();
    }
}
