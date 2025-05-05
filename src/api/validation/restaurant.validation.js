const Joi = require('joi')

const addRestaurant = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            name:Joi.string().required(),
            addresses:Joi.object().required(),
            menu:Joi.array().items(Joi.object({
                name:Joi.string().required(),
                price:Joi.number().required()
            })).required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}
const getAllRestaurant = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            search:Joi.string().optional()
        })
        req.query = await schema.validateAsync(req.query)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

module.exports ={
    addRestaurant,
    getAllRestaurant
}