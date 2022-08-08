const route = require('express').Router()
const  WithdrawController = require('../Controller/WithdrawController')

route.post('/',WithdrawController.create)
route.put('/history',WithdrawController.withdraw)
module.exports  = route