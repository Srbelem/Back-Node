const route = require('express').Router()
const  WalletController = require('../Controller/WalletController')

route.put('/',WalletController.wallet)
route.put('/:type',WalletController.walletFilter)
route.put('/:type/updateGanhou',WalletController.walletUpdateGanhou)
route.put('/:type/updatePerdeu',WalletController.walletUpdatePerdeu)
route.put('/create/:type',WalletController.walletCreate)

module.exports  = route