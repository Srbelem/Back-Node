const route = require('express').Router()
const  Betting_historyController = require('../Controller/Betting_historyController')

route.post('/create',Betting_historyController.createHistoric)
route.post('/getHistorico',Betting_historyController.getHistoric)

//route.get('/bank',PaymentController.banks)

module.exports  = route