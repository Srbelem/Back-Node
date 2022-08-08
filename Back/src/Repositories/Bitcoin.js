const bitcoin = require('bitcoinjs-lib')
var express = require('express');
var app = express();

const Web3 = require('web3')
const env = require('../Config/env');
async function getHistoricBlockByTimestamp(block, the_address, txs) {
    for (var j = 0; j < block.transactions.length; j++) {
        if (block.transactions[j].to == the_address) {
            await txs.push(block.transactions[j].to);
        }
    }

    return txs;

}

class Bitcoin {
    constructor() {
    }
    async createAccount() {
        try {
            //console.log(bitcoin.networks.testnet)
            const enviroment = true
            const network = enviroment == true ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
            const keyPair = bitcoin.ECPair.makeRandom({ network: network });
            const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: network });
            const publicKey = keyPair.publicKey.toString('hex');
            const privateKey = keyPair.toWIF();
            return { address, privateKey, publicKey };
        } catch (error) {
            return 'error'
        }

    }
    async transfer(receiver, value) {
        try {

            const enviroment = false
            const network = enviroment == true ? bitcore.Networks.livenet : bitcore.Networks.testnet
            //--------------------------------------
            bitcore.Networks.defaultNetwork = network
            var privateKey = new bitcore.PrivateKey('');
            var utxo = {
                "txId": "",
                "outputIndex": 0,
                "address": "",
                "script":  new bitcore.Script(address).toHex(),
                "satoshis": 50000
            };

            var transaction = new bitcore.Transaction()
                .from(utxo)
                .to('', 15000)
                .sign(privateKey);

            console.log(transaction)

            //    Set the network to testnet
                    //private key wallet FROM
                    var key = bitcoin.ECPair.fromWIF("",network);
                    //The above should output: 17hFoVScNKVDfDTT6vVhjYwvCu6iDEiXC4
                   // console.log(key.pub.getAddress().toString());
                    var tx = new bitcoin.Psbt();

                    //FROm
                    tx.addInput({hash:"",index: 0});
                    // TO ,satoshis
                    tx.addOutput("", 200000); // 1000 satoshis will be taken as fee.
                    tx.sign(0, key);

                    console.log(tx.build().toHex());
            return
        } catch (err) {
            console.log(err)
            return err
        }
    }
    async balance(address) {
        try {
            return
        } catch (err) {
            return err
        }
    }
    async postback() {
        try {

            const enviroment = false
            var historicDate = new Date();
            historicDate.setMonth(historicDate.getMonth());

            console.log(historicDate)
            const network = enviroment == true ? env.mainnet : env.rinkeby
            this.web3 = new Web3(network)
            let address = ''
            var n = await this.web3.eth.getBlockNumber();
            let the_address = ''

            var txs = [];
            console.log(n)
            var block = await this.web3.eth.getBlock(9585861, true);
            for (var j = 0; j < block.transactions.length; j++) {
                        if (block.transactions[j].to == the_address)
                            txs.push(block.transactions[j]);
                    }
                    //cria transaçao e salvar bd

            for (var i = n; i > 0; i--) {
                console.log(i)
                var block = await this.web3.eth.getBlock(i, true);
                let txs2 = await getHistoricBlockByTimestamp(block, the_address, txs)
                txs = txs2
                if (txs.length > 0) {

                    console.log(txs)
                    break
                }
            }
            let blockNum = await this.web3.eth.getBlockNumber();
            const historicTimestamp = new Date(historicDate).getTime();
            console.log(historicTimestamp)
            console.log(blockNum)
            while (true) {
                const block = await this.web3.eth.getBlock(blockNum);
                console.log(block)
                if (block.timestamp < historicTimestamp) break;
                --blockNum;
            }

            //The blockNumber here is your required block number
            let balance = await this.web3.eth.getBalance(address, blockNum);


               this.web3.eth.getBalance(account, 10000).then(balance => {console.log(`balance for ${account} at block 10000 is ${balance}`)});
            return
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
module.exports = Bitcoin;