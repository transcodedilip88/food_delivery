const Joi = require('joi')
const messages = require('../config/messages.json')

const addOrder = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            userId:Joi.string().required(),
            restaurantId:Joi.string().required(),
            deliveryAddress:Joi.object().required(),
            items:Joi.array().items(Joi.object({
                name:Joi.string().required(),
                price:Joi.number().required(),
                quantity:Joi.number().required()
            })),
            paymentInfo:Joi.object().optional()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}

const getOrderById = async(req,res,next)=>{
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

const getAllOrders = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            search:Joi.string().optional(),
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

const updateOrderById = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            assignedAgent:Joi.string().required(),
            status:Joi.string().optional()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({mesasge:messages.ERROR,erro:error.message})
    }
}

const sendDeliveryOtp = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            id:Joi.string().required()
        })
        req.params = await schema.validateAsync(req.params)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}

const otpVerification = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            otp:Joi.number().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}

module.exports ={
    addOrder,
    getOrderById,
    getAllOrders,
    updateOrderById,
    sendDeliveryOtp,
    otpVerification
}