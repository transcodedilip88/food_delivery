const Joi = require('joi')
const messages = require('../config/messages.json')

const signUp = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            firstName:Joi.string().optional(),
            lastName:Joi.string().optional(),
            email:Joi.string().email().optional(),
            role:Joi.string().optional(),
            password : Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).optional().messages({ 'string.pattern.base': 'Password is not strong' }),
            phone:Joi.number().required(),
            profileImage:Joi.string().required(),
            addresses:Joi.object().optional(),
            favoriteRestaurant:Joi.string().optional(),
            vehicleType:Joi.string().valid('bike','scooter').optional(),
            currrentLocation:Joi.object().optional(),
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error);
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const login = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            email:Joi.string().required(),
            password:Joi.string().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const verify = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            verifyToken:Joi.string().required(),
            otp:Joi.number().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const forgotPassword = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            email:Joi.string().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const resetPassword = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            newPassword:Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).required().messages({ 'string.pattern.base': 'Password is not strong' }),
            verifyToken:Joi.string().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

module.exports ={
    signUp,
    login,
    verify,
    forgotPassword,
    resetPassword
}