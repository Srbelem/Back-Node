const WalletMo = require('../Model/WalletModel')
const ValidUser = require('../Repositories/validerUser')

const EthereumController = require('./EthereumController')
const Bitcoin = require('../Repositories/Bitcoin')
const bitcoin = new Bitcoin()
class Wallet {
    static async wallet(req, res) {
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const wallets = await WalletMo.findAll({ where: { uid: id } })
                const response = {
                    "wallet": {
                        "hash": wallet.hash,
                        "type": wallet.type,
                        "balance": wallet.balance,
                    },
                }
                return res.status(200).json(response)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (err) {
            return res.status(400).json({ err: "Wallet error" })

        }

    }
    static async walletCreate(req, res) {

        try {
            const { type } = req.params
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {

                let id = checkUser.sucess.id
                if (type == 1) {
                    const bitcoinWallet = await bitcoin.createAccount()
                    const wallet = await WalletMo.findOne({ where: { uid: id, type } })
                    if (wallet.hash == null || wallet.hash == undefined || wallet.hash == '') {
                        wallet.hash = bitcoinWallet.address
                        wallet.privatekey = bitcoinWallet.privateKey
                        wallet.publickey = bitcoinWallet.publicKey
                        wallet.save()
                        const response = {
                            "wallet": {
                                "hash": wallet.hash,
                                "type": wallet.type,
                            },

                        }
                        return res.status(200).json(response)

                    } else {
                        return res.status(400).json({ error: { mensagen: 'wallet existing', flag: "wallet" } })

                    }

                } else if (type == 1027) {
                    const etherWallet = await EthereumController.createAccount()
                    const wallet = await WalletMo.findOne({ where: { uid: id, type } })
                    if (wallet.hash == null || wallet.hash == undefined || wallet.hash == '') {
                        wallet.hash = etherWallet.address
                        wallet.privatekey = etherWallet.privateKey.replace('0x', '')
                        wallet.save()
                        const response = {
                            "wallet": {
                                "hash": wallet.hash,
                                "type": wallet.type,
                            },

                        }
                        return res.status(200).json(response)

                    } else {
                        return res.status(400).json({ error: { mensagen: 'wallet existing', flag: "wallet" } })

                    }


                }




            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (err) {
            return res.status(400).json({ err: "Wallet creater error" })

        }

    }
    static async walletFilter(req, res) {
        try {
            const { type } = req.params
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)

            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const wallet = await WalletMo.findOne({ where: { uid: id, type } })
                const walletBRL = await WalletMo.findOne({ where: { uid: id, type: 0 } })
                const response = {
                    "wallet": {
                        "hash": wallet.hash,
                        "type": wallet.type,
                        "balance": wallet.balance,
                    },
                    "walletBRL": {
                        "hash": walletBRL.hash,
                        "type": walletBRL.type,
                        "balance": walletBRL.balance,
                    }
                }
                return res.status(200).json(response)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }

        } catch (err) {
            return res.status(400).json({ err: "Wallet error" })

        }
    }


    static async walletUpdateGanhou(req, res) {
        try {
            const { type } = req.params
            const { authKey, valor } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const wallet = await WalletMo.findOne({ where: { uid: id, type: 0 } })
                await WalletMo.update({
                    balance: wallet.balance + valor
                }, {
                    where: {
                        uid: id,
                        type: 0
                    }
                })

                const response = {
                    "wallet": {
                        "balance":  wallet.balance + valor,
                    }
                }
                // const wallet = await WalletMo.findOne({ where: { uid: id, type } })
                // const walletBRL = await WalletMo.findOne({ where: { uid: id, type: 0 } })
                // const response = {
                //     "wallet": {
                //         "hash": wallet.hash,
                //         "type": wallet.type,
                //         "balance": wallet.balance,
                //     },
                //     "walletBRL": {
                //         "hash": walletBRL.hash,
                //         "type": walletBRL.type,
                //         "balance": walletBRL.balance,
                //     }
                // }
                return res.status(200).json(response)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }

        } catch (err) {
            return res.status(400).json({ err: "Wallet error" })

        }
    }

    static async walletUpdatePerdeu(req, res) {
        try {
            const { type } = req.params
            const { authKey, valor } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const wallet = await WalletMo.findOne({ where: { uid: id, type: 0 } })
                await WalletMo.update({
                    balance: wallet.balance - valor
                }, {
                    where: {
                        uid: id,
                        type: 0
                    }
                })

                const response = {
                    "wallet": {
                        "balance":  wallet.balance - valor,
                    }
                }
                return res.status(200).json(response)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }

        } catch (err) {
            return res.status(400).json({ err: "Wallet error" })

        }
    }

}

module.exports = Wallet