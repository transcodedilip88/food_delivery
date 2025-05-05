const express = require('express')
const authRoute = require('./auth.route')
const restaurantRoute = require('./restaurant.route')
const orderRoute = require('./order.route')
const userRoute = require('./user.route')

const router = express.Router()

router.use(authRoute)
router.use(restaurantRoute)
router.use(orderRoute)
router.use(userRoute)

module.exports = router