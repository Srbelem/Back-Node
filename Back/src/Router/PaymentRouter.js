const route = require('express').Router()
const  PaymentController = require('../Controller/PaymentController')

route.post('/',PaymentController.create)
route.post('/card',PaymentController.creditCardRedirect)
route.post('/pix',PaymentController.pix)
route.post('/validaPix',PaymentController.validaPix)
// route.get('/:id',PaymentController.payments)
route.post('/history',PaymentController.payments)
route.get('/bank',PaymentController.banks)
route.post('/statusUpdated',PaymentController.postback)
route.put('/maxValue',PaymentController.maxValue)
module.exports  = route