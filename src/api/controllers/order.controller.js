const constants = require('../../constants');
const messages = require('../config/messages.json');
const universalFunctions = require('../lib/universal-functions');
const { Order , User,Otp} = require('../models')
const {mongoService,sendMail} = require('../services')
const {getGlobalSocketPromise,isSocketConnedted} = require('../routes/socket')

const ObjectId = require('mongoose').Types.ObjectId;
 
const addOrder = async(req,res)=>{
    try{
        let io = await getGlobalSocketPromise();

        let {userId,restaurantId,deliveryAddress,items,paymentInfo} = req.body

        let dataToSave = {
            userId:new ObjectId(userId),
            restaurantId:new ObjectId(restaurantId),
            deliveryAddress,
            items,
            createdBy:new ObjectId(req?.user?.id),
            updatedBy:new ObjectId(req?.user?.id),
            paymentInfo
        }

        let order = await mongoService.createData(Order,dataToSave)

        let response = {
            data:order.items
        }

        if(!isSocketConnedted()){
            console.log("user not conneted")
        }

        let longitude = deliveryAddress.location.coordinates[0]
        let latitude = deliveryAddress.location.coordinates[1]


        let userCriteria = {
            isLogin:true,
            isDeleted:false,
            role:constants.USER_ROLE.DELIVERY_BOY,
            currrentLocation:{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:[longitude,latitude]
                    },
                    $maxDistance: 10000000
                }
            }
        }

        let users = await mongoService.getData(User,userCriteria,{},{})

        let populate = [
            {
                path:'restaurantId',
                select:'_id name addresses'
            },
            {
                path:'userId',
                select:'firstName lastName phone'
            }
        ]

        let orderDetail = await mongoService.findOneAndPopulate(Order,{_id:order._id},{},{},populate)

        for(let user of users){
            
            let socketData ={
                message:'New Order Recived',
                orderDetail,
                deliveryAddress
            }

            if(io && user.socketId){
                io.to(user.socketId).emit('new-order-recived',socketData)
            }   
        }
        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getOrderById = async(req,res)=>{
    try{
        let id = req.params.id

        let criteria ={
            _id:new ObjectId(id),
        }

        if(req.user.role === constants.USER_ROLE.DELIVERY_BOY){
            criteria.assignedAgent = new ObjectId(req?.user?.id)
        }

        console.log("req?.user?.id= > ",req?.user?.id)

        let order = await mongoService.getFirstMatch(Order,criteria,{},{})

        if(!order){
            return res.send({message:'order assigned to other user'})
        }

        let response ={
            data:order
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getAllOrders = async(req,res)=>{
    try{
        let {search,skip,limit} = req.query

        let options = {
            skip:parseInt(skip) || constants.pagination.defaultSkip,
            limit:parseInt(limit) || constants.pagination.defaultLimit,
            sort:{createdAt:-1}
        }

        let criteria ={}

        if(req.user.role === constants.USER_ROLE.DELIVERY_BOY){
            criteria.assignedAgent = new ObjectId(req?.user?.id)
        }

        if(req.user.role === constants.USER_ROLE.USER){
            criteria.userId = new ObjectId(req?.user?.id)
        }

        if (search) {
            criteria["items.name"] = { $regex: search, $options: "i" }; 
        }

        let populate = [
            {
                path:'userId',
                select:'firstName lastName addresses _id'
            },
            {
                path:'restaurantId',
                select:'name addresses menu'
            },
            {
                path:'assignedAgent',
                select:'name mobile profileImage'
            }
        ]

        let orders = await mongoService.findAllWithPopulate(Order,criteria,{},options,populate)
        let ordersCount = await mongoService.countData(Order,criteria)

        let response = {
            data:orders,
            count:ordersCount
        }


        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const updateOrderById = async(req,res)=>{
    try{
        let id = req.params.id

        let {assignedAgent,status} = req.body

        let criteria = {
            _id:new ObjectId(id),
        }

        let dataToSet ={
            status:status,
            updatedBy:new ObjectId(req?.user?.id)
        }

        if(assignedAgent){
            dataToSet.assignedAgent = new ObjectId(assignedAgent)
        }

        let order = await mongoService.updateData(Order,criteria,dataToSet,{})

        let response = {
            data:order
        }

        res.status(200).json({message:'order confirmed',response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const sendDeliveryOtp = async(req,res)=>{
    try{
        let id = req.params.id

        
        let orderCriteria = {
            _id:new ObjectId(id)
        }

        let populate ={
            path:'userId',
            select:'email'
        }

        
        let order = await mongoService.findOneAndPopulate(Order,orderCriteria,{},{},populate)
        console.log("order => ",order)
        
        if(!order){
            return res.status(404).json({message:messages.DATA_NOT_FOUND})
        }

        let otp = await universalFunctions.generate_otp()

        let otpData = {
            userId:new ObjectId(order._id),
            type:"deliveryCode",
            otp:otp
        }
        await mongoService.createData(Otp,otpData)
        
        console.log("order.userId.email => ",order.userId.email)

        // await sendMail.deliveryOtp(order.userId.email,otp)

        res.status(200).json({message:'Otp send successFully.'})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const otpVerification = async(req,res)=>{
    try{
        let id = req.params.id

        let{otp} = req.body

        let orderCriteria = {
            _id:new ObjectId(id)
        }

        let order = await mongoService.getFirstMatch(Order,orderCriteria,{},{})

        if(!order){
            return res.status(404).json({message:messages.DATA_NOT_FOUND})
        }

        let otpCriteria = {
            userId:new ObjectId(order._id),
            type:'deliveryCode'
        }

        let otpData = await mongoService.getFirstMatch(Otp,otpCriteria,{},{sort:{createdAt:-1}})

        console.log("otpData => ",otpData)
        if(otpData.otp !== otp){
            return res.status(403).json({message:messages.INVALID_OTP})
        }

        await mongoService.updateData(Order,{_id:order._id},{status:'delivered',updatedBy:new ObjectId(req?.user?.id)})
        await mongoService.updateData(Otp,{userId:order?._id},{otp:null},{sort:{createdAt:-1}})
        res.status(200).json({message:messages.OTP_VERIFIED})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
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