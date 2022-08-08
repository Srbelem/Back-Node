const yup = require('yup')
const Order = require('../Model/OrderModel')
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')
const LatamGateway = require('../Repositories/LatamGateway')
const axios = require('axios')
const env = require('../Config/env')
const ValidUser = require('../Repositories/validerUser')
class OrderController {
    static async create(req, res) {
        try {
            const { description, authKey, type, status, priceMedia, finalValue, quantity, tax, dispare, inputType, outputType } = req.body
            const schema = yup.object().shape({
                description: yup.string().required('Descrição Obrigatória'),
                type: yup.string().required('Type Obrigatória'),
                status: yup.number().required('Status Obrigatória'),
                priceMedia: yup.number().required('priceMedia Obrigatório'),
                quantity: yup.number().required('quantity Obrigatório'),
                inputType: yup.number().required('input Obrigatório'),
                outputType: yup.number().required('output Obrigatório')
            })
            schema.validate(req.body)
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let uid = checkUser.sucess.id
                let order = 0
                //console.log(req.body)
                const walletInput = await Wallet.findOne({ where: { uid, type: inputType } })
                const walletOutput = await Wallet.findOne({ where: { uid, type: outputType } })
                if (type == 'buy' && walletInput.dataValues.balance >= finalValue) {
                    
                    const outputBalance = walletOutput.balance +  parseFloat(quantity)
                    const inputBalance = walletInput.balance -  parseFloat(finalValue)
                    const output = await Wallet.update({ balance: outputBalance.toFixed(7) }, { where: { uid, type: outputType } })
                    const input = await Wallet.update({ balance: inputBalance.toFixed(2) }, { where: { uid, type: inputType } })
                    order = await Order.create({ description, uid, type, status, priceMedia, finalValue, quantity, tax, dispare, inputType, outputType })

                } else if (type == 'sell' && walletOutput.dataValues.balance >= quantity) {
                    const outputBalance = walletOutput.balance - parseFloat(quantity)
                    const inputBalance = walletInput.balance + parseFloat(finalValue)
                    const input = await Wallet.update({ balance: inputBalance.toFixed(2) }, { where: { uid, type: inputType } })
                    const output = await Wallet.update({ balance: outputBalance.toFixed(7) }, { where: { uid, type: outputType } })
                    order = await Order.create({ description, uid, type, status, priceMedia, finalValue, quantity, tax, dispare, inputType, outputType })
                } else {
                    return res.status(400).json({
                        erro: "Saldo insuficiente"
                    })
                }
                return res.status(200).json(order)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
          
        } catch (err) {
            console.log(err)
            return res.status(400).json(err.message)
        }
    }
    static async order(req, res) {
        try {
            const { id } = req.params
            const orders = (await Member.findByPk(id, { include: { association: 'Orders' } }))
            return res.status(200).json(orders.Orders)
        } catch (err) {
            return res.status(400).json(err.message)
        }
    }
    static async orderFilter(req, res) {
        try {
            const { id, output } = req.params
            const orders = (await Member.findByPk(id, { include: { association: 'Orders' } })).Orders
            const ordersOutput = orders.filter(e => {
                return e.dataValues.outputType == output
            })
            res.status(200).json({ output: ordersOutput })
        } catch (err) {
            return res.status(400).json(err.message)
        }
    }
}

module.exports = OrderController