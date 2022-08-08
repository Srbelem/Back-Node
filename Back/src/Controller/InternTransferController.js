const yup = require('yup')
const InternTransfer = require('../Model/InternTransferModel')
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')
const LatamGateway = require('../Repositories/LatamGateway')
const axios = require('axios')
const env = require('../Config/env')
const Ethereum = require('../Repositories/Ethereum')
const { randomUUID } = require('crypto')
const ethereum = new Ethereum()
var CryptoJS = require("crypto-js")
const keyUser = require('../Config/config.json').keyCripto.key
const ValidUser = require('../Repositories/validerUser')

class InternTransferController {
    static async create(req, res) {
        try {
            const { authKey, type, status, quantity, coinType, receiverHash, name } = req.body
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let uid = checkUser.sucess.id
                var bytes2 = CryptoJS.AES.decrypt(receiverHash, keyUser);
                var receiverID = parseInt(bytes2.toString(CryptoJS.enc.Utf8));
                const schema = yup.object().shape({
                    type: yup.string().required('Type Obrigatória'),
                    status: yup.number().required('Status Obrigatória'),
                    quantity: yup.number().required('quantity Obrigatório'),
                    coinType: yup.number().required('coinType Obrigatório'),
                })
                schema.validate(req.body)
                let InternTransferWallet = 0
                let tax = 0
                let hash = ''
                const walletSender = await Wallet.findOne({ where: { uid, type: coinType } })
                const walletreceiver = await Wallet.findOne({ where: { uid: receiverID, type: coinType } })
                if (walletSender.dataValues.balance >= parseFloat(quantity)) {
                    const outputBalance = walletreceiver.balance + parseFloat(quantity)
                    const inputBalance = walletSender.balance - parseFloat(quantity)
                    const input = await Wallet.update({ balance: inputBalance }, { where: { uid, type: coinType } })
                    const receiver = await Wallet.update({ balance: outputBalance }, { where: { uid: receiverID, type: coinType } })
                    InternTransferWallet = await InternTransfer.create({ uid, uuid: receiverID, type, status, quantity, tax, hash, coinType, receiverAddress: name })
                } else {
                    return res.status(400).json({
                        erro: "Insufficient funds"
                    })
                }
                return res.status(200).json(InternTransfer)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({ err: 'Unexpected error' })
        }
    }
    static async InternTransfer(req, res) {
        try {
            const { authKey } = req.body
            var bytes = await CryptoJS.AES.decrypt(authKey, keyUser);
            var userHash = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            let id = userHash.id
            const response = []
            const inter = await InternTransfer.findAll({ include: { association: 'receiver' } })
            const filtro = await inter.map(async users => {
                if (users.uid == id) {
                    let nome = ''
                    if (users.receiver != undefined) {
                        nome = users.receiver.firstName + " " + users.receiver.secondName
                    }
                    response.push({
                        tranferTyper: "Sent",
                        type: users.type,
                        status: users.status,
                        quantity: users.quantity,
                        coinType: users.coinType,
                        nameUser: nome,
                        createdAt: users.createdAt
                    })
                }
            })
            return res.status(200).json(response)
        } catch (err) {
            return res.status(400).json({ err: 'Unexpected error' })
        }
    }
    static async InternTransferReceiver(req, res) {
        try {

            const { authKey } = req.body
            var bytes = await CryptoJS.AES.decrypt(authKey, keyUser);
            var userHash = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            let id = userHash.id

            let ciphertext = ""
            var bytes2 = CryptoJS.AES.decrypt(ciphertext, keyUser);
            var originalText = bytes2.toString(CryptoJS.enc.Utf8);
            const response = []
            const inter = await InternTransfer.findAll({ include: { association: 'user' } })
            const filtro = await inter.map(async users => {
                if (users.uuid == id) {
                    let nome = ''
                    if (users.user != undefined) {
                        nome = users.user.firstName + " " + users.user.secondName
                    }
                    response.push({
                        tranferTyper: "Received",
                        type: users.type,
                        status: users.status,
                        quantity: users.quantity,
                        coinType: users.coinType,
                        nameUser: nome,
                        createdAt: users.createdAt
                    })
                }
            })
            return res.status(200).json(response)

        } catch (err) {
            console.log(err)
            return res.status(400).json({ err: 'Unexpected error' })
        }
    }

    static async check(req, res) {
        try {
            const { type, key } = req.body
            let receiver = {}
            if (type == 'email') {
                receiver = await Member.findOne({ where: { email: key } })
            } else if (type == 'mobile') {
                receiver = await Member.findOne({ where: { mobile: key } })
            } else if (type == 'login') {
                receiver = await Member.findOne({ where: { login: key } })
            } else if (type == 'hash') {
                const walletReceiver = await Wallet.findOne({ where: { hash: key } })
                if (walletReceiver) {
                    receiver = await Member.findOne({ where: { id: walletReceiver.uid } })
                } else {
                    return res.status(400).json({ error: 'Wallet not found' })
                }
            }
            if (receiver) {
                // // Encrypt
                var ciphertext = CryptoJS.AES.encrypt(receiver.id.toString(), keyUser).toString();
                // // Decrypt
                // var bytes = CryptoJS.AES.decrypt(ciphertext, key);
                // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                // console.log(decryptedData); // [{id: 1}, {id: 2}]
                return res.status(200).json({ receiverHash: ciphertext, nome: receiver.firstName, secondname: receiver.secondName })
            } else {
                return res.status(406).json({ error: 'User not found' })
            }
        } catch (err) {
            return res.status(400).json({ err: 'Unexpected error' })
        }
    }
}

module.exports = InternTransferController