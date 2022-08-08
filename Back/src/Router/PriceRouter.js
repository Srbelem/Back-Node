const Route = require('express').Router()
const  PriceController = require('../Controller/PriceController')

Route.get('/', PriceController.getPrices)
Route.get('/prices', PriceController.getPrices2) 
Route.get('/allprices',PriceController.getAllPrices)
Route.post('/gas',PriceController.getGasPrice)
Route.get('/uprice/:type', PriceController.getuPrices)
module.exports  = Route