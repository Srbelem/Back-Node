const express = require('express')
const IdSuex = require('../Repositories/IDSUEX')
const idsuex = new IdSuex()
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')

class IdSuexController {
    static async createAccount() {
        try {
            const account = await idsuex.createAccount()
            return account;
        } catch (err) {
            return "erro"
        }
    }
    static async transfer(req, res) {
        try {
            const { userIdDocument, receiveIdDocument, value, typeTransaction, description } = req.body;
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
            const user = await Member.findOne({
                where: {
                    IdDocument: userIdDocument
                }
            })
            const receiver = await Member.findOne({
                where: {
                    IdDocument: receiveIdDocument
                }
            })
            if (!user) {
                return res.status(400).json({ Error: 'User not found' })
            }
            if (!receiver) {
                return res.status(400).json({ Error: 'Receiver not found' })
            }
            const walletReceiver = await Wallet.findOne({
                where: {
                    uid: receiver.id
                }
            })
            const walletUser = await Wallet.findOne({
                where: {
                    uid: user.id
                }
            })
            if (walletUser.balance < value) {
                return res.status(400).json({ Error: 'Insufficient funds' })
            }
            let transfer
            if (typeTransaction == 1) {
                transfer = await idsuex.transfer(walletUser, walletUser, value, description)
            } else {
                transfer = await idsuex.transferOffChange(walletUser, walletUser, value, description)
            }
            if (transfer.status == 400) {
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
                return res.status(400).json({ Error: 'Adress null' })

            }
            const balance = await idsuex.balance(address)
            return res.status(200).json(balance)
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }
    static setValue(goldGram, eur, dol) {
        const goldGramPerc = goldGram * 1.44
        const eurPerc = eur * 1.45
        const dolPerc = dol * 1.55
        const media = (goldGramPerc + dolPerc + eurPerc) / 3
        const final = media + ((media / 100) * 11)
        return final
    }
}
module.exports = IdSuexController