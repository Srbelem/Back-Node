const yup = require('yup')
const Withdrawfiat = require('../Model/WithdrawFiatModel')
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')
const Price = require('./PriceController').getPrices
const ValidUser = require('../Repositories/validerUser')
class WithdrawController {
    static async createBank(req, res) {

        try {
            const { authKey, account, status, quantity, holderName } = req.body
            const schema = yup.object().shape({
                status: yup.number().required('Status Obrigatória'),
                account: yup.number().required('Account Obrigatória'),
                quantity: yup.string().required('quantity Obrigatório'),
            })
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let uid = checkUser.sucess.id
                const type = 0
                const coinType = 0
                schema.validate(req.body)
                let withdraw = 0
                let tax = 0
                const walletInput = await Wallet.findOne({ where: { uid, type: coinType } })
                if (walletInput.dataValues.balance >= quantity) {
                    await Wallet.update({ balance: walletInput.balance - quantity }, { where: { uid, type: coinType } })

                    withdraw = await Withdrawfiat.create({ uid, type, account, status, quantity, tax, coinType, holderName })

                } else {
                    return res.status(400).json({
                        erro: "Saldo insuficiente"
                    })
                }
                return res.status(200).json(withdraw)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }


        } catch (err) {
            return res.status(400).json(err.message)
        }
    }
    static async createPix(req, res) {
        try {
            const { authKey, pix, quantity, holderName } = req.body
            const schema = yup.object().shape({
                pix: yup.number().required('Pix Obrigatória'),
                status: yup.number().required('Status Obrigatória'),
                quantity: yup.string().required('quantity Obrigatório'),
                authKey: yup.string().required('ID user Obrigatória'),
            })
            schema.validate(req.body)
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let uid = checkUser.sucess.id
                const type = 1
                const coinType = 0
                let withdraw = 0
                let tax = 0
                let status = 0
                const walletInput = await Wallet.findOne({ where: { uid, type: coinType } })
                if (walletInput.dataValues.balance >= quantity) {
                    const input = await Wallet.update({ balance: walletInput.balance - quantity }, { where: { uid, type: coinType } })
                    withdraw = await Withdrawfiat.create({ uid, type, pix, status, quantity, tax, coinType, holderName })
                } else {
                    return res.status(400).json({
                        erro: "Saldo insuficiente"
                    })
                }
                return res.status(200).json(withdraw)
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
    static async getHistory(req, res) {
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const withdraws = (await Member.findByPk(id, { include: { association: 'WithdrawFiat', attributes: ['status', 'account', 'pix', 'type', 'coinType', 'updatedAt', 'createdAt', 'quantity', 'holderName'] } }))
                return res.status(200).json(withdraws.WithdrawFiat)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (err) {
            return res.status(400).json({ err: 'erro get historic fiat' });
        }
    }
    static async Withdrawfiat(req, res) {
        try {
            const { id } = req.params
            const withdraw = (await Member.findByPk(id, { include: { association: 'WithdrawFiat' } }))
            return res.status(200).json(withdraw.WithdrawFiats)
        } catch (err) {
            return res.status(400).json(err.message)
        }
    }
}

module.exports = WithdrawController