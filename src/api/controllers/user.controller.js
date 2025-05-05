const constants = require('../../constants')
const messages = require('../config/messages.json')
const { User} = require('../models')
const {mongoService} = require('../services')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const getUserById = async(req,res)=>{
    try{
        let id = req.params.id

        let userCriteria = {
            _id:new ObjectId(id),
            isDeleted:false
        }

        let user = await mongoService.getFirstMatch(User,userCriteria,{},{})

        if(!user){
            return res.status(404).json({mesasge:messages.DATA_NOT_FOUND})
        }

        let response = {
            data:user
        }

        res.status(200).json({message:messages.SUCCESS,response})

    }catch(error){
        console.log("error : ",error)
        res.status(500).json({mesasge:messages.ERROR,erro:error.message})
    }
}

const getAllUsers  = async(req,res)=>{
    try{
        let {search,limit,skip,favoriteRestaurant} = req.query

        let userCriteria = {
            isDeleted:false
        }

        if(search){
            userCriteria.$or=[
                {firstName:{$regex:search,$options:'i'}},
                {lastName:{$regex:search,$options:'i'}},
                {vehicleType:{$regex:search,$options:'i'}}
            ]
        }

        if(favoriteRestaurant){
            userCriteria.favoriteRestaurant = new ObjectId(favoriteRestaurant)
        }

        let options = {
            skip:parseInt(skip) || constants.pagination.defaultSkip,
            limit:parseInt(limit) || constants.pagination.defaultLimit,
            sort:{createdAt:-1}
        }

        let users = await mongoService.getData(User,userCriteria,{},options)
        let usersCount = await mongoService.countData(User,userCriteria)

        let response = {
            data:users,
            count:usersCount
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({mesasge:messages.ERROR,erro:error.message})
    }
}

const updateUserById = async(req,res)=>{
    try{
        let id = req.params.id

        let {firstName,lastName,profileImage,favoriteRestaurant,currrentLocation,vehicleType} = req.body

        let userCriteria = {
            _id:new ObjectId(id),
            isDeleted:false
        }

        let user = await mongoService.getFirstMatch(User,userCriteria,{},{})

        if(!user){
            return res.status(403).json({message:messages.DATA_NOT_FOUND})
        }

        let dataToSet = {
            firstName,
            lastName,
            profileImage,
            vehicleType,
            currrentLocation
        }

        if(favoriteRestaurant){
            dataToSet.favoriteRestaurant = new ObjectId(favoriteRestaurant)
        }

        user = await mongoService.updateData(User,userCriteria,dataToSet,{})

        let response = {
            data:user
        }
        
        res.status(200).json({mesasge:messages.SUCCESS,response})
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