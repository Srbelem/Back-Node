const route = require('express').Router()
const  InternTransferController = require('../Controller/InternTransferController')

route.post('/',InternTransferController.create)
route.post('/check',InternTransferController.check)
route.put('/sender',InternTransferController.InternTransfer)
route.put('/receiver',InternTransferController.InternTransferReceiver)
module.exports  = route