const route = require('express').Router()
const  WithdrawFiatController = require('../Controller/WithdrawFiatController')
route.post('/bank/',WithdrawFiatController.createBank)
route.post('/pix/',WithdrawFiatController.createPix)
route.put('/getHistory',WithdrawFiatController.getHistory)
module.exports  = route