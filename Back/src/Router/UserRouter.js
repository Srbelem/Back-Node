const express = require('express')
const router = express.Router()
const  UserController = require('../Controller/UserController')
const multer = require("multer");
const multerConfig = require("../Config/multer");

router.post('/register',UserController.store)
router.post('/registerSimple',UserController.storeSimple)
router.get('/delet/:email',UserController.delet)
router.post('/cpf',UserController.buscaDados)
router.put('/update/image',multer(multerConfig).single('file'),UserController.updateFile)
router.put('/update',UserController.update)

router.put('/password',UserController.checkPassword)
router.put('/email/:id',UserController.updateEmail)
router.put('/createTwoFactor',UserController.createTwoFactor)
router.put('/confirmTwoFactor',UserController.confirmTwoFactor)
router.put('/checkTwoFactor',UserController.checkTwoFactor)
router.put('/validTwoFactor',UserController.validTwoFactor)
router.post('/resetPassword',UserController.resetPassword)
router.post('/logout',UserController.logout)

router.put('/validUser',UserController.validUser)
router.post('/idRegister',UserController.idRegister)
module.exports  = router