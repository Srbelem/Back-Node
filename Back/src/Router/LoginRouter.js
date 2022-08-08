const express = require('express')
const router = express.Router()
const  LoginController = require('../Controller/LoginController')

router.post('/login',LoginController.login)
router.post('/logout',LoginController.logout)

router.post('/forgot',LoginController.forgot)
router.post('/resetConfirmData',LoginController.resetConfirmData)
router.put('/reset',LoginController.reset)

router.get('/username/:login',LoginController.usernameVerification)
router.put('/login/CheckAuth',LoginController.validTwoFactor)


router.post('/validateEmail',LoginController.validateEmail)
router.post('/confirmEmail',LoginController.confirmEmail)

router.post('/confirmRemove2FA',LoginController.confirmRemove2FA)

module.exports  = router