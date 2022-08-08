const Route = require('express').Router()
const  EthereumController = require('../Controller/EthereumController')

Route.post('/createAccount',EthereumController.createAccount)
Route.get('/balanceof', EthereumController.balanceOf)
Route.post('/transfer', EthereumController.transfer)
Route.post('/refreshBalance', EthereumController.refreshBalance)

module.exports  = Route