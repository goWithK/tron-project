// Outgoing Global Throttler
const globalConfig = {
    reservoir: 30, // number of new jobs that throttler will accept at start
    reservoirRefreshAmount: 30, // number of jobs that throttler will accept after refresh
    reservoirRefreshInterval: 1500, // interval in milliseconds where reservoir will refresh
};

// Outgoing Group Throttler
const groupConfig = {
    maxConcurrent: 1, // only 1 job at a time
    minTime: 1000, // wait this many milliseconds to be ready, after a job
    reservoir: 20, // number of new jobs that throttler will accept at start
    reservoirRefreshAmount: 20, // number of jobs that throttler will accept after refresh
    reservoirRefreshInterval: 60000, // interval in milliseconds where reservoir will refresh
};

// Outgoing Private Throttler
const outConfig = {
    maxConcurrent: 1, // only 1 job at a time
    minTime: 1500, // wait this many milliseconds to be ready, after a job
};

const exchangeMapping = {
    "0x71660c4005BA85c37ccec55d0C4493E66Fe775d3": "Coinbase",
    "0x503828976D22510aad0201ac7EC88293211D23Da": "Coinbase",
    "0xddfAbCdc4D8FfC6d5beaf154f18B778f892A0740": "Coinbase",
    "0x3cD751E6b0078Be393132286c442345e5DC49699": "Coinbase",
    "0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511": "Coinbase",
    "0xeB2629a2734e272Bcc07BDA959863f316F4bD4Cf": "Coinbase",
    "0xD688AEA8f7d450909AdE10C47FaA95707b0682d9": "Coinbase",
    "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE": "Binance",
    "0xD551234Ae421e3BCBA99A0Da6d736074f22192FF": "Binance",
    "0x564286362092D8e7936f0549571a803B203aAceD": "Binance",
    "0x0681d8Db095565FE8A346fA0277bFfdE9C0eDBBF": "Binance",
    "0xfE9e8709d3215310075d67E3ed32A380CCf451C8": "Binance",
    "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8": "Binance",
    "0xF977814e90dA44bFA03b6295A0616a897441aceC": "Binance",
    "0x28C6c06298d514Db089934071355E5743bf21d60": "Binance",
    "0x85b931A32a0725Be14285B66f1a22178c672d69B": "Binance",
    "0x708396f17127c42383E3b9014072679b2F60B82f": "Binance",
    "0xE0F0CfDe7Ee664943906f17F7f14342E76A5CeC7": "Binance",
    "0x8F22F2063D253846B53609231eD80FA571Bc0C8F": "Binance",
    "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549": "Binance",
    "0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b": "OKX",
    "0x236F9F97e0E62388479bf9E5BA4889e46B0273C3": "OKX",
    "0xA7EFAe728D2936e78BDA97dc267687568dD593f3": "OKX",
    "0x2c8FBB630289363Ac80705A1a61273f76fD5a161": "OKX",
    "0x59FAE149A8f8EC74d5bC038F8b76D25b136b9573": "OKX",
    "0x98EC059Dc3aDFBdd63429454aEB0c990FBA4A128": "OKX",
    "0x5041ed759Dd4aFc3a72b8192C143F72f4724081A": "OKX",
    "0x461249076B88189f8AC9418De28B365859E46BfD": "OKX",
    "0xD152f549545093347A162Dce210e7293f1452150": "Disperse.app",
    "0x2B5634C42055806a59e9107ED44D43c426E58258": "Kucoin",
    "0x689C56AEf474Df92D44A1B70850f808488F9769C": "Kucoin",
    "0xa1D8d972560C2f8144AF871Db508F0B0B10a3fBf": "Kucoin",
    "0x4ad64983349C49dEfE8d7A4686202d24b25D0CE8": "Kucoin",
    "0x1692E170361cEFD1eb7240ec13D048Fd9aF6d667": "Kucoin",
    "0xD6216fC19DB775Df9774a6E33526131dA7D19a2c": "Kucoin",
    "0xe59Cd29be3BE4461d79C0881D238Cbe87D64595A": "Kucoin",
    "0x899B5d52671830f567BF43A14684Eb14e1f945fe": "Kucoin",
    "0xf16E9B0D03470827A95CDfd0Cb8a8A3b46969B91": "Kucoin",
    "0x4E5B2e1dc63F6b91cb6Cd759936495434C7e972F": "FixedFloat"
}

export { globalConfig, groupConfig, outConfig , exchangeMapping};
