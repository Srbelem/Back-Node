const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const env = require('../Config/env');
const abi = require('../Config/abi')
const ethers = require('ethers');
const Wallet = require('../Model/WalletModel')
const gasPrice = require('../Model/GasPriceModel')
const globalConfig = require('../Config/globalConfig.json')
const Price = require('../Model/PriceModel')
const UmbrellaInfo = require('../Model/UmbrellaInfoModel')
const ExTransfer = require('../Model/ExTransferModel')

class Ethereum {
    constructor() {
    }
    async createAccount() {
        this.web3 = new Web3(env.mainnet);
        const user = await this.web3.eth.accounts.create();
        return user;
    }
    async getGasPrice() {
        const gas = await gasPrice.findAll()
        return gas
    }
    async fetchTaxes() {
        try {
            this.web3 = new Web3(env.mainnet);
            const gasPrice = await this.web3.eth.getGasPrice()
            console.log("gas", gasPrice)
            const ethGasPrice = this.web3.utils.fromWei(gasPrice, 'ether')
            const avConv = gasPrice - 3000000000
            const slowConv = gasPrice - 6000000000
            const averageGasPrice = this.web3.utils.fromWei(avConv.toString(), 'ether')
            const slowGasPrice = this.web3.utils.fromWei(slowConv.toString(), 'ether')
            const gweigasPrice = this.web3.utils.fromWei(gasPrice.toString(), 'gwei');
            return {
                fast: (ethGasPrice * 45000).toFixed(7),
                average: (averageGasPrice * 45000).toFixed(7),
                safeLow: (slowGasPrice * 45000).toFixed(7),
                gweigasPrice: gweigasPrice
            }
        } catch (err) {
            return err;
        }
    }
    async transfer(receiver, value, gasPrice) {
        let gasLimitPrice = globalConfig.gasLimit
        let motherWalletHash = globalConfig.motherWallet
        try {
            const enviroment = true
            const network = enviroment == true ? env.mainnet : env.rinkeby
            this.web3 = new Web3(network)
            const motherWallet = await Wallet.findOne({ where: { hash: motherWalletHash } })
            const privateKeyHex = Buffer.from(motherWallet.privatekey, 'hex')
            let newValue = (value * 1e18)
            const txCount = await this.web3.eth.getTransactionCount(motherWalletHash)
            // const finalValue = value - (gasLimitPrice * this.web3.utils.toWei(gasPrice.toString(), 'gwei'))
            // if (finalValue < 0) {
            //     console.log("aqui")
            //     return { error: 'Insuficient founds for gas * price + value - API' }
            // }

            const txObject = {
                from: motherWalletHash,
                nonce: this.web3.utils.toHex(txCount),
                gasLimit: this.web3.utils.toHex(gasLimitPrice),
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(gasPrice.toString(), 'gwei')),
                to: receiver,
                value: newValue
            }
            console.log("Valor Transferido: ", value)
            const tx = new Tx(txObject)
            tx.sign(privateKeyHex)
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            const resul = {
            }
            await this.web3.eth.sendSignedTransaction(raw)
                .once('transactionHash', function (hash) {
                    resul.hash = hash
                    console.log("txHash", hash)
                })
                .once('receipt', function (receipt) {
                    resul.gasused = receipt.gasUsed
                    console.log("receipt", receipt)
                })
                .on('error', function (error) {
                    console.log("error", error)
                })

            //erro string
            // const tax = this.web3.utils.fromWei(resul.gasUsed.toString(), 'ether');
            // resul.tax = tax
            console.log(resul)
            return resul;

            // const enviroment = true
            // const network = enviroment == true ? env.mainnet : env.rinkeby
            // this.web3 = new Web3(network)
            // // remove
            // const finalValue = value - (gasLimitPrice * this.web3.utils.toWei(gasPrice, 'gwei'))
            // if (finalValue < 0) {
            //     return { error: 'Insuficient founds for gas * price + value - API' }
            // }
            // const privateKeyHex = Buffer.from(user.privatekey, 'hex')
            // const txCount = await this.web3.eth.getTransactionCount("0x68c5F38cAA6B23BbA86EE3635dfa29f5166521A5")
            // //  const txCount = await this.web3.eth.getTransactionCount(motherWallet.hash)
            // //  const txCount = await this.web3.eth.getTransactionCount(user.hash)
            // console.log(gasLimitPrice)
            // const txObject = {
            //     from: user.hash,
            //     nonce: this.web3.utils.toHex(txCount),
            //     gasLimit: this.web3.utils.toHex(gasLimitPrice),
            //     gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(gasPrice.toString(), 'gwei')),
            //     to: receiver,
            //     value: value
            // }
            // console.log("Valor Transferido: ", value)
            // const tx = new Tx(txObject)
            // tx.sign(privateKeyHex)
            // const serializedTx = tx.serialize()
            // const raw = '0x' + serializedTx.toString('hex')
            // const resul = {
            // }
            // await this.web3.eth.sendSignedTransaction(raw)
            //     .once('transactionHash', function (hash) {
            //         resul.hash = hash
            //         console.log("txHash", hash)
            //     })
            //     .once('receipt', function (receipt) {
            //         resul.gasused = receipt.gasUsed
            //         console.log("receipt", receipt)
            //     })
            //     .on('error', function (error) {
            //         console.log("error", error)
            //     })
            // const tax = this.web3.utils.fromWei(resul.gasUsed, 'ether');
            // resul.tax = tax
            // return resul;
        } catch (err) {
            console.log(err)
            return err
        }
    }
    async ExchangeTransferToken(receiver, value, gasPrice, coinType) {
        try {
            let tokenData = await Price.findOne({ where: { coin: coinType } })
            const contractHash = tokenData.dataValues.token_hash
            let decimal = '1e' + tokenData.dataValues.decimais

            console.log(receiver, " ", value, " ", gasPrice)
            const limitGas = globalConfig.gasLimit
            let motherWalletHash = globalConfig.motherWallet
            const enviroment = true
            const network = enviroment == true ? env.mainnet : env.rinkeby
            //const contractHash = enviroment == true ? env.contract : env.rinkebyContract
            //    // const finalvalue = (value * 10000000)
            const motherWallet = await Wallet.findOne({ where: { hash: motherWalletHash, type: 12345 } })
            this.web3 = new Web3(network);
            console.log(contractHash)
            this.contract = new this.web3.eth.Contract(abi.abi, contractHash);
            const privateKeyHex = Buffer.from(motherWallet.privatekey, 'hex')
            const txCount = await this.web3.eth.getTransactionCount(motherWalletHash)
            console.log("tx :", txCount)
            //  const gasPrice3 = await this.web3.eth.getGasPrice()
            const gasPrice3 = this.web3.utils.toWei(gasPrice.toString(), 'gwei')
            let newvalue = (value * parseFloat(decimal))
            const txObject = {
                nonce: this.web3.utils.toHex(txCount),
                gasLimit: this.web3.utils.toHex(limitGas.toString()),
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(gasPrice.toString(), 'gwei')),
                to: contractHash,
                data: this.contract.methods.transfer(receiver, newvalue).encodeABI(),
            }


            const tx = new Tx(txObject)
            tx.sign(privateKeyHex)

            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            const signed = await this.web3.eth.accounts.signTransaction(txObject, privateKeyHex)
            const txHash = await this.web3.utils.sha3(signed.rawTransaction)
            // let resul = await this.web3.eth.sendSignedTransaction(raw)
            // console.log('..............')
            // console.log(resul)

            // resul.tax = tax
            const resul = await this.web3.eth.sendSignedTransaction(signed.rawTransaction)
            const tax = this.web3.utils.fromWei(resul.gasUsed.toString(), 'ether');
            console.log(resul)
            return { transactionHash: txHash, raw }


            // //         const privateKeyHex = Buffer.from(motherWallet.privatekey, 'hex')
            // //        
            // //         const txCount = await this.web3.eth.getTransactionCount(motherWallet.hash)
            // //         const txObject = {

            // //             nonce: this.web3.utils.toHex(txCount),
            // //             gasLimit: this.web3.utils.toHex(limitGas),
            // //             gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(gasPrice, 'gwei')),
            // //             to: env.contract,
            // //             data: this.contract.methods.transfer(receiver, value ).encodeABI(),
            // //         }
            // //         const tx = new Tx(txObject)
            // //         tx.sign(privateKeyHex)
            // //         const serializedTx = tx.serialize()
            // //         const raw = '0x' + serializedTx.toString('hex')
            // //         let resul = await this.web3.eth.sendSignedTransaction(raw)
            // //         console.log('..............')
            // //         console.log(resul)
            // //         const tax =  this.web3.utils.fromWei(resul.gasUsed, 'ether');
            // //         resul.tax = tax
            // //     return resul;
        } catch (err) {
            console.log("aqui", err)
            return err
        }
    }
    async ExchangeTransferETH(receiver, value) {

        try {
            const limitGas = globalConfig.gasLimit
            const enviroment = true
            const network = enviroment == true ? env.mainnet : env.rinkeby
            const motherWallet = await Wallet.findOne({ where: { hash: '' } }).Wallet.dataValues
            this.web3 = new Web3(network);
            this.contract = new this.web3.eth.Contract(abi.abi, env.contract);
            const privateKeyHex = Buffer.from(motherWallet.privateKey, 'hex')
            const txCount = await this.web3.eth.getTransactionCount(motherWallet.address)
            const txObject = {
                from: motherWallet.address,
                nonce: this.web3.utils.toHex(txCount),
                gasLimit: this.web3.utils.toHex(limitGas),
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('30', 'gwei')),
                to: receiver,
            }
            const tx = new Tx(txObject)
            tx.sign(privateKeyHex)
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            const resul = await this.web3.eth.sendSignedTransaction(raw)
            const tax = this.web3.utils.fromWei(resul.gasUsed, 'ether');
            resul.tax = tax
            return resul;
        } catch (err) {
            return err
        }
    }
    async balance(address) {
        try {
            const enviroment = true
            const network = enviroment == true ? env.mainnet : env.rinkeby
            this.web3 = new Web3(network)
            const weiBalance = await this.web3.eth.getBalance(address)
            console.log(weiBalance)
            const balanceof = this.web3.utils.fromWei(weiBalance, 'ether')
            return weiBalance
        } catch (err) {
            return err
        }
    }
    async postback() {
        try {
            const bdBlockBoo = await UmbrellaInfo.findOne({ where: { uid: 10 } });
            console.log(bdBlockBoo.inProcess)
            if (!(bdBlockBoo.inProcess)) {
                bdBlockBoo.inProcess = true
                await bdBlockBoo.save();
                const enviroment = true
                var historicDate = new Date();
                historicDate.setMonth(historicDate.getMonth());
                const bdBlock100 = await UmbrellaInfo.findOne({where: { uid: 10 } });
                console.log(bdBlock100.dataValues.currentBlock)
                let block100 = bdBlock100.dataValues.currentBlock

                // console.log(historicDate)
                const network = enviroment == true ? env.mainnet : env.rinkeby
                this.web3 = new Web3(network)
                var newBlock = await this.web3.eth.getBlockNumber();
                let the_address = ''

                var txs = [];
                for (var i = newBlock; i > block100; i--) {
                 //   console.log(i)
                    var block = await this.web3.eth.getBlock(i, true);
                    for (var j = 0; j < block.transactions.length; j++) {
                        //adicionar todas carteiras
                        if (block.transactions[j].to) {
                            const trans = block.transactions[j]
                            // console.log(trans)
                            const userWallet = await Wallet.findOne({ where: { hash: block.transactions[j].to, type: 1027 } })
                            const transactionBD = await ExTransfer.findOne({ where: {  txHash: trans.hash } })
                            if (userWallet && !(transactionBD)) {
                                const value = parseFloat(this.web3.utils.fromWei(trans.value, 'ether'))
                                const finalValue = userWallet.balance + value
                                const walletAtt = await Wallet.update({ balance: finalValue }, { where: { hash: trans.to, type: 1027 } })
                                const transaction = await ExTransfer.create({ receiver: userWallet.uid, type: 1027, value: value, txHash: trans.hash, from: trans.from, to: trans.to })
                                console.log({
                                    to: trans.to,
                                    address: trans.from,
                                    value: trans.value
                                })
                            }
                        }
                        // if (block.transactions[j].to == the_address) {
                        //     console.log('achou')
                        //     await txs.push(block.transactions[j].to);
                        // }
                    }
                }
                console.log('acbaou')
                bdBlock100.currentBlock = newBlock
                bdBlock100.inProcess = false
                await bdBlock100.save();

                console.log("chegou")
            } else {
                let aux = bdBlockBoo.count
                bdBlockBoo.count = aux+1
                await  bdBlockBoo.save();
                console.log("esperando")
            }
            // const enviroment = false
            // var historicDate = new Date();
            // historicDate.setMonth(historicDate.getMonth());
            // const bdBlock100 = await UmbrellaInfo.findOne({ attributes: ['currentBlock'], where: { uid: 10 } });
            // console.log(bdBlock100.dataValues.currentBlock)
            // let block100 = bdBlock100.dataValues.currentBlock

            // // console.log(historicDate)
            // const network = enviroment == true ? env.mainnet : env.rinkeby
            // this.web3 = new Web3(network)
            // var newBlock = await this.web3.eth.getBlockNumber();
            // let the_address = '0x0B914e224C4514a9C7Ad7cf7a33edAC2e2D526BD'

            // var txs = [];
            // for (var i = 9652280; i > block100; i--) {
            //     console.log(i)
            //     var block = await this.web3.eth.getBlock(i, true);
            //     let txs2 = await getHistoricBlockByTimestamp(block)
            // }
            // console.log('acbaou')
            // bdBlock100.currentBlock = newBlock
            // await bdBlock100.save();
            return
            // var block = await this.web3.eth.getBlock(9585861, true);
            // for (var j = 0; j < block.transactions.length; j++) {
            //             if (block.transactions[j].to == the_address)
            //                  console.log('achou')
            //                 txs.push(block.transactions[j]);
            //         }
            //         //cria transaçao e salvar bd


            // let blockNum = await this.web3.eth.getBlockNumber();
            // const historicTimestamp = new Date(historicDate).getTime();
            // console.log(historicTimestamp)
            // console.log(blockNum)
            // while (true) {
            //     const block = await this.web3.eth.getBlock(blockNum);
            //     console.log(block)
            //     if (block.timestamp < historicTimestamp) break;
            //     --blockNum;
            // }
            // console.log('passou')

            // //The blockNumber here is your required block number
            // let balance = await this.web3.eth.getBalance(address, blockNum);
            // console.log("acbaou", balance)


            //    this.web3.eth.getBalance(account, 10000).then(balance => { console.log(`balance for ${account} at block 10000 is ${balance}`) });
            // return 
            // const enviroment = false
            // const network = enviroment == true ? env.mainnet : env.rinkeby
            // this.web3 = new Web3(network)
            // var n =  await this.web3.eth.getBlockNumber();


            // const block = await this.web3.eth.getBlock('latest')
            // if (block && block.transactions) {
            //     for (let transaction of block.transactions) {
            //         const trans = await this.web3.eth.getTransaction(transaction)
            //         if (trans.to) {
            //             const userWallet = await Wallet.findOne({ where: { hash: trans.to, type: 1027 } })
            //             if (userWallet) {
            //                 const finalValue = userWallet.balance + parseFloat(this.web3.utils.fromWei(trans.value, 'ether'))
            //                 const walletAtt = await Wallet.update({ balance: finalValue }, { where: { hash: trans.to, type: 1027 } })
            //                 console.log({
            //                     to: trans.to,
            //                     address: trans.from,
            //                     value: trans.value
            //                 })
            //             }
            //         }
            //     }
            // }
            // return block
        } catch (err) {
            const bdBlockBd = await UmbrellaInfo.findOne({ where: { uid: 10 } });
            bdBlockBd.inProcess = false
            console.log(err)
            return err
        }
    }
}
async function getHistoricBlockByTimestamp(block,) {
    for (var j = 0; j < block.transactions.length; j++) {
        //adicionar todas carteiras
        if (block.transactions[j].to) {
            const trans = block.transactions[j]
            // console.log(trans)
            const userWallet = await Wallet.findOne({ where: { hash: block.transactions[j].to, type: 1027 } })

            if (userWallet) {
                const value = parseFloat(this.web3.utils.fromWei(trans.value, 'ether'))
                // const finalValue = userWallet.balance + value

                // const walletAtt = await Wallet.update({ balance: finalValue }, { where: { hash: trans.to, type: 1027 } })
                const transaction = await ExTransfer.create({ receiver: userWallet.uid, type: 1027, value: value, txHash: trans.hash, from: trans.from, to: trans.to })
                console.log({
                    to: trans.to,
                    address: trans.from,
                    value: trans.value
                })
            }
        }
        // if (block.transactions[j].to == the_address) {
        //     console.log('achou')
        //     await txs.push(block.transactions[j].to);
        // }
    }

    return;

}
module.exports = Ethereum;