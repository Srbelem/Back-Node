const yup = require('yup')
const Withdraw = require('../Model/WithdrawModel')
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')
const LatamGateway = require('../Repositories/LatamGateway')
const axios = require('axios')
const env = require('../Config/env')
const Ethereum = require('../Repositories/Ethereum')
const ethereum = new Ethereum()
const ValidUser = require('../Repositories/validerUser')

class WitidrawController {
    static async create(req, res) {
        try {
            const { authKey, type, status, quantity, coinType, receiverAddress, gas, tax, receiverValue } = req.body
            const schema = yup.object().shape({
                type: yup.string().required('Type Obrigatória'),
                status: yup.number().required('Status Obrigatória'),
                quantity: yup.number().required('quantity Obrigatório'),
                coinType: yup.number().required('coinType Obrigatório'),
                receiverAddress: yup.number().required('receiverAddress Obrigatório'),
            })
            schema.validate(req.body)

            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let withdraw = 0
                //let tax = 0
                let hash = ''
                let transfer = {}
                let uid = checkUser.sucess.id
                const walletInput = await Wallet.findOne({ where: { uid, type: coinType } })
                //        console.log(walletInput)
                if (walletInput.dataValues.balance >= parseFloat(quantity)) {
                    let walletSender = walletInput.dataValues
                    console.log(walletSender.balance)
                    console.log(parseFloat(quantity))
                    const inputBalance = walletSender.balance - parseFloat(quantity)
                    const input = await Wallet.update({ balance: inputBalance }, { where: { uid, type: coinType } })
                    if (coinType == 12345) {
                        console.log('transfering')
                        transfer = await ethereum.ExchangeTransferToken(receiverAddress, parseFloat(receiverValue), gas, coinType)
                        console.log('..........', transfer)
                        withdraw = await Withdraw.create({ uid, type, status, quantity, tax: transfer.tax, hash: transfer.transactionHash, coinType, receiverAddress })
                    } else if (coinType == 1027) {
                        transfer = await ethereum.transfer(receiverAddress, parseFloat(receiverValue), gas)
                        withdraw = await Withdraw.create({ uid, type, status, quantity, tax: transfer.tax, hash: transfer.transactionHash, coinType, receiverAddress })
                    }
                    //         console.log(walletInput)
                } else {
                    return res.status(400).json({
                        erro: "Insufficient funds22"
                    })
                }
                // return res.status(200)
                return res.status(200).json(withdraw)

            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }


            // if (walletInput.dataValues.balance >= parseFloat(quantity)) {
            //     const inputBalance = walletSender.balance - parseFloat(quantity)
            //     const input = await Wallet.update({ balance: inputBalance }, { where: { uid, type: coinType } })
            //     if (coinType == 12345) {
            //         console.log('transfering')
            //         transfer = await ethereum.ExchangeTransferIDX(receiverAddress, parseFloat(quantity), '25')
            //         console.log('..........', transfer)
            //         withdraw = await Withdraw.create({ uid, type, status, quantity, tax: transfer.tax, hash: transfer.transactionHash, coinType, receiverAddress })
            //     } else if (coinType == 1027) {
            //         transfer = await ethereum.ExchangeTransferETH(receiverAddress, parseFloat(quantity))
            //         withdraw = await Withdraw.create({ uid, type, status, quantity, tax: transfer.tax, hash: transfer.transactionHash, coinType, receiverAddress })
            //     }
            // } else {
            //     return res.status(400).json({
            //         erro: "Insufficient funds"
            //     })
            // }
            // return res.status(200).json(withdraw)
        } catch (err) {
            return res.status(400).json({ err: 'Unexpected error' })
        }
    }
    static async getGasPrice(req, res) {
        try {
            const gas = await ethereum.getGasPrice()
            console.log(gas)
            return res.status(201).json({ gas });
        } catch (err) {
            return res.status(400).json({ err: 'erro no gas' })
        }
    }
    static async withdraw(req, res) {
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            let id = checkUser.sucess.id
            const withdraws = (await Member.findByPk(id, { include: { association: 'Withdraws',attributes: [ 'status', 'receiverAddress', 'createdAt','type','coinType','quantity']} }))
            return res.status(200).json(withdraws.Withdraws)
        } catch (err) {
            return res.status(400).json({ err: 'Unexpected error' })
        }
    }
}

module.exports = WitidrawController