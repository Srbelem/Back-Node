const express = require('express')
const Ethereum = require('../Repositories/Ethereum')
const ethereum = new Ethereum()
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')

class EthereumController {
    static async createAccount() {
        try {
            const account = await ethereum.createAccount()
            return account;
        } catch (err) {
            return "erro"
        }
    }
    static async transfer(req, res) {
        try {
            const { userIdDocument, receiveIdDocument, value, typeTransaction } = req.body;
            if (userIdDocument == receiveIdDocument) {
                return res.status(400).json({ Error: 'Identical Identifier' })
            }
            if (userIdDocument == null) {
                return res.status(400).json({ Error: 'Adress null' })
            }
            if (typeTransaction == null) {
                return res.status(400).json({ Error: 'typeTransaction null' })
            }
            if (receiveIdDocument == null) {
                return res.status(400).json({ Error: 'adressTo Key null' })
            }
            if (value == null || value == 0) {
                return res.status(400).json({ Error: 'Value null' })

            }
            const user = await Member.findOne({where:{
                IdDocument:userIdDocument
            }})
            const receiver = await Member.findOne({where:{
                IdDocument:receiveIdDocument
            }})
            if(!user){
                return res.status(400).json({ Error: 'User not found' })
            }
            if(!receiver){
                return res.status(400).json({ Error: 'Receiver not found' })
            }
            const walletReceiver = await Wallet.findOne({where:{
                uid:receiver.id
            }})
            const walletUser = await Wallet.findOne({where:{
                uid:user.id
            }})
            if(walletUser.balance<value){
                return res.status(400).json({ Error: 'Insufficient funds' })
            }
            let transfer
            if(typeTransaction==1){
                 transfer = await ethereum.transfer(walletUser, walletUser,value)
            }else{
                 transfer = await ethereum.transferOffChange(walletUser, walletUser,value)
            }
            if(transfer.status==400){
                return res.status(400).json({ Error: transfer.error })
            }
            return res.status(200).json(transfer.transaction);
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }
    static async balanceOf(req, res) {
        try {
            const { address } = req.body
            if (address == null) {
                return res.status(400).json({ Error: 'Address null' })
            }
            const balance = await ethereum.balance(address)
            return res.status(200).json(balance)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ error: err })
        }

    }
    static async refreshBalance(req, res) {
        try {
            const {  address } = req.body
            const balance = address ? await ethereum.balance(address) : -1
            if(balance > 0) {
                const walletInput = await Wallet.findOne({ where: { hash: address } })  
                const transferMother = await ethereum.transfer(walletInput, '', balance)
                console.log(transferMother)
                const walletAtt = await Wallet.update({ balance: walletInput.balance + balance }, { where: { hash: address } })
                //const walletAtt = await Wallet.update({ balance: walletInput.balance + (balance - (transferMother.tax + (transferMother.tax * 0.1))) }, { where: { hash: address } })
            }
            return res.status(200).json(balance)
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }
}
module.exports = EthereumController