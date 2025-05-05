const messages = require('../config/messages.json')
const { Restaurant } = require('../models')
const {mongoService} = require('../services')

const addRestaurant = async(req,res)=>{
    try{
        let {name,addresses,menu} = req.body

        let isExist = await mongoService.getFirstMatch(Restaurant,{name:name},{},{})

        if(isExist){
            return res.status(403).json({message:messages.NAME_IN_USE})
        }

        let dataToSave ={
            name,
            addresses,
            menu
        }

        let restaurant = await mongoService.createData(Restaurant,dataToSave)

        let response  ={
            data:restaurant
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}

const getAllRestaurant = async(req,res)=>{
    try{
        let {search} = req.query

        let criteria = {};

        if (search) {
          criteria["menu.name"] = { $regex: search, $options: "i" }; 
        }
        
        let restaurant = await mongoService.getData(Restaurant,criteria,{},{})

        let response ={
            data:restaurant
        }

        res.status(200).json({message:messages.SUCCESS,response})

    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}


module.exports ={
    addRestaurant,
    getAllRestaurant
}