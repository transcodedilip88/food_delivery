const Joi = require('joi')
const messages = require('../config/messages.json')

const getUserById = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            id:Joi.string().required()
        })
        req.params = await schema.validateAsync(req.params)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({mesasge:messages.ERROR,erro:error.message})
    }
}

const getAllUsers = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            search:Joi.string().optional(),
            favoriteRestaurant:Joi.string().optional(),
            skip:Joi.number().optional(),
            limit:Joi.number().optional()
        })
        req.query = await schema.validateAsync(req.query)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({mesasge:messages.ERROR,erro:error.message})
    }
}

const updateUserById = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            firstName:Joi.string().optional(),
            lastName:Joi.string().optional(),
            profileImage:Joi.string().optional(),
            favoriteRestaurant:Joi.string().optional(),
            currrentLocation:Joi.object().optional(),
            vehicleType:Joi.string().optional()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({mesasge:messages.ERROR,erro:error.message})
    }
}

module.exports ={
    getUserById,
    getAllUsers,
    updateUserById
}