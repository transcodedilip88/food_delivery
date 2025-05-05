const express = require('express')
const { userValidation } = require('../validation')
const { isAuthenticated } = require('../controllers/auth.controller')
const { USER_ROLE } = require('../../constants')
const { userController } = require('../controllers')
const router = express()

router.get('/users',userValidation.getAllUsers,isAuthenticated([...Object.values(USER_ROLE)]),userController.getAllUsers)
router.get('/user/:id',userValidation.getUserById,isAuthenticated([...Object.values(USER_ROLE)]),userController.getUserById)
router.put('/user/:id/update',userValidation.updateUserById,isAuthenticated([...Object.values(USER_ROLE)]),userController.updateUserById)

module.exports = router