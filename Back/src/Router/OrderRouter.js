const route = require('express').Router()
const  OrderController = require('../Controller/OrderController')

route.post('/',OrderController.create)
route.get('/:id',OrderController.order)
route.get('/:id/:output',OrderController.orderFilter)
module.exports  = route