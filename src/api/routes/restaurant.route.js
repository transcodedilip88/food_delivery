const express = require('express')
const { restaurantValidation } = require('../validation')
const { restaurantController } = require('../controllers')
const { isAuthenticated } = require('../controllers/auth.controller')
const { USER_ROLE } = require('../../constants')
const router = express.Router()

router.post('/restaurant/add',restaurantValidation.addRestaurant,restaurantController.addRestaurant)
router.get('/restaurants',restaurantValidation.getAllRestaurant,isAuthenticated([...Object.values(USER_ROLE)]),restaurantController.getAllRestaurant)

module.exports = router