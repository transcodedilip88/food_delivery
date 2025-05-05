const express = require('express')
const { authValidation } = require('../validation')
const { authController } = require('../controllers')
const router = express.Router()

router.post('/auth/signup',authValidation.signUp,authController.signUp)
router.post('/auth/login',authValidation.login,authController.login)
router.put('/auth/verify',authValidation.verify,authController.verify)
router.put('/auth/forgotPassword',authValidation.forgotPassword,authController.forgotPassword)
router.put('/auth/resetPassword',authValidation.resetPassword,authController.resetPassword)

module.exports = router