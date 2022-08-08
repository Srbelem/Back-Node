const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const env = require('../Config/env');
const abi = require('../Config/abi')
const ethers = require('ethers');
const Wallet = require('../Model/WalletModel')
const Transaction = require('../Model/TransactionModel')
class IDSUEX {
    constructor() {
        this.web3 = new Web3(env.ropsten);
        this.contract = new this.web3.eth.Contract(abi.abi, env.contract);
    }
    async createAccount() {
        const user = await this.web3.eth.accounts.create();
        return user;
    }
    async createAccountEhters() {
        const mnemonic = await ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
        console.log(mnemonic)
        const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
        console.log(wallet)
        return wallet;
    }
    async transfer(user, receiver, value,description) {
        try {
            const privateKeyHex = Buffer.from(user.privateKey, 'hex')
            const txCount = await this.web3.eth.getTransactionCount(user.address)
            const txObject = {
                nonce: this.web3.utils.toHex(txCount),
                gasLimit: this.web3.utils.toHex(800000),
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei')),
                to: env.contract,
                data: this.contract.methods.transfer(receiver.adress, value).encodeABI(),
            }
            const tx = new Tx(txObject)
            tx.sign(privateKeyHex)
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            const resul = await this.web3.eth.sendSignedTransaction(raw)
            const transaction = await Transaction.create()
            return resul;
        } catch (err) {
            return err
        }

    }
    async balance(address) {
        try {
            const balanceof = await this.contract.methods.balanceOf(address).call()
            return balanceof;
        } catch (err) {
            return err
        }
    }

    async transferOffChange(user, receiver, value,description){
        try{
            const wallatUser = await Wallet.update({value:user.value-value},{where:{id:user.id}})
        const wallatReceiver= await Wallet.update({value:user.value+value},{where:{id:receiver.id}})
        const transaction = await Transaction.create({description,uid:wallatUser.uid,receiver:wallatReceiver.uid,type:3,value})
        return {status:200,transaction}
        }catch(err){
            return {status:400,error:err}
        }
        
    }
}
module.exports = IDSUEX;