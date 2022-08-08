const route = require('express').Router()
const accountBank  = require('../Controller/AccountBankController')

route.get('/banks',accountBank.banks)
route.get('/:id',accountBank.banksUser)
route.get('/pix/:id',accountBank.pixUser)
route.post('/register',accountBank.registryBank)
route.post('/registerpix',accountBank.registerPix)


module.exports  = route