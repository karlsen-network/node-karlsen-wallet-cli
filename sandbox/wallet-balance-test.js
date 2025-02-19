#!/usr/bin/env node

const { Wallet, initKarlsenFramework } = require('@karlsen/wallet');
const { RPC } = require('@karlsen/grpc-node');

const network = 'karlsendev';
const rpc = new RPC({
    clientConfig:{
        host:"127.0.0.1:"+Wallet.networkTypes[network].port
    }
});

let dump = (label, text, deco1="-", deco2="=")=>{
    console.log(`\n${label}:\n${deco1.repeat(100)}\n${text}\n${deco2.repeat(100)}\n`)
}

const run = async ()=>{

    await initKarlsenFramework();

    //let wallet = Wallet.fromMnemonic("live excuse stone acquire remain later core enjoy visual advice body play");
    let wallet = Wallet.fromMnemonic("wasp involve attitude matter power weekend two income nephew super way focus",{network, rpc});

    dump("mnemonic created", wallet.mnemonic)
    console.log("NETWORK:",wallet.network);

    wallet.on("blue-score-changed", (result)=>{
        let {blueScore} = result;
        console.log("blue-score-changed:result, blueScore", result, blueScore)
    })

    wallet.on("balance-update", ()=>{
        console.log("wallet:balance-update", wallet.balance)
    })

    wallet.syncVirtualSelectedParentBlueScore()
    .catch(e=>{
        console.log("syncVirtualSelectedParentBlueScore:error", e)
    })

    let debugInfo = await wallet.addressDiscovery(20, true)
    .catch(e=>{
        console.log("addressDiscovery:error", e)
    })

    dump("receiveAddress", wallet.receiveAddress)
    if(!debugInfo)
        return
    /*
    debugInfo.forEach((info, address)=>{
        console.log("debugInfo",  address, info)
    })
    */

    /*
    let response = await wallet.submitTransaction({
        toAddr: "karlsentest:qrhefqj5c80m59d9cdx4ssxw96vguvn9fgy6yc0qtd",
        amount: 1000,
        fee: 400
    }, true).catch(async (error)=>{
        console.log("\n\nerror", error)
    })

    console.log("\n\nResponse", response)
    */

    const addresses = Object.keys(wallet.addressManager.all);
    const utxosChangedCallback = (res)=>{
        console.log("utxosChangedCallback:res", JSON.stringify(res, null, "\t"))
    }
    let UtxoChangedRes = await rpc.subscribeUtxosChanged(addresses, utxosChangedCallback);
    //console.log("addresses", addresses)
    console.log("UtxoChangedRes", UtxoChangedRes)
    console.log("wallet.balance", wallet.balance)

    //rpc.disconnect();
}

run();
