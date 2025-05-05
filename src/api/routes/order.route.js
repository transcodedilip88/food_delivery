const express = require('express')
const { orderValidation } = require('../validation')
const { isAuthenticated } = require('../controllers/auth.controller')
const { USER_ROLE } = require('../../constants')
const { orderController } = require('../controllers')
const router = express.Router()

router.post('/order/add',orderValidation.addOrder,isAuthenticated([...Object.values(USER_ROLE)]),orderController.addOrder)
router.get('/order/:id',orderValidation.getOrderById,isAuthenticated([...Object.values(USER_ROLE)]),orderController.getOrderById)
router.get('/orders',orderValidation.getAllOrders,isAuthenticated([...Object.values(USER_ROLE)]),orderController.getAllOrders)
router.put('/order/:id/update',orderValidation.updateOrderById,isAuthenticated([...Object.values(USER_ROLE)]),orderController.updateOrderById)
router.post('/order/:id/sendOtp',orderValidation.sendDeliveryOtp,isAuthenticated([USER_ROLE.DELIVERY_BOY]),orderController.sendDeliveryOtp)
router.post('/order/:id/verify',orderValidation.otpVerification,isAuthenticated([USER_ROLE.DELIVERY_BOY]),orderController.otpVerification)

module.exports = router