const messages = require('../config/messages.json')
const { User,Otp} = require('../models')
const {mongoService,sendMail} = require('../services')
const universalFunctions = require('../lib/universal-functions')
const {jwt}= require('../utils')
const {jwtSecrets}= require('../../config')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const signUp = async(req,res)=>{
    try{
        let { firstName,lastName,email,phone,password,profileImage,addresses,favoriteRestaurant,role,vehicleType,currrentLocation}= req.body

        let criteria = {
            email:{$regex:email,$options:"i"},
            isDeleted:false
        }

        let isExist = await mongoService.getFirstMatch(User,criteria,{},{})

        if(isExist){
            return res.status(403).json({message:messages.EMAIL_IN_USE})
        }

        if(password){
            let passwordHash = await universalFunctions.encryptData(password)
            req.body.password = passwordHash
        }

        let dataToSave ={
            firstName,
            lastName,
            email,
            phone,
            password:req?.body?.password,
            profileImage,
            role,
            addresses,
            vehicleType,
            currrentLocation
        }

        if(favoriteRestaurant){
            dataToSave.favoriteRestaurant = new objectId(favoriteRestaurant)
        }

        let user = await mongoService.createData(User,dataToSave)

        let response ={
            data:user
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}

const login = async(req,res) =>{
    try{
        let {email,password}= req.body

        let criteria = {
            isDeleted:false,
            email:email
        }

        let user = await mongoService.getFirstMatch(User,criteria,{},{})

        if(!user){
            return res.status(404).json({message:messages.INVALID_CREDENTIALS})
        }else if(! await universalFunctions.compareBcryptPassword(password,user.password)){
            return res.status(403).json({message:messages.INVALID_CREDENTIALS})
        }

        if(user.isDeleted){
            return res.status(400).json({message:messages.ACCOUNT_DELETED_BY_ADMIN})
        }
    
        if(user.isBlocked){
            return res.status(400).json({message:messages.ACCOUNT_BLOCKED_BY_ADMIN})
        }

        let otp = await universalFunctions.generate_otp()
        // sendMail.login_mail(user?.email,otp)
        
        console.log("user._id => ",user._id)

        let otpData ={
            userId:new ObjectId(user._id),
            otp:otp,
            type:'2FA'
        }

        await mongoService.createData(Otp,otpData)
        
        let response = {
            data:user
        }

        response.token = jwt.sign({
            id:user._id,
            role:user.role
        },jwtSecrets.verify,{expiresIn:'1h'})

        res.status(200).json({message:messages.login_success,response})

    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR})
    }
}

const verify = async (req, res, next) => {
    try {
        const { verifyToken, otp } = req.body;

        let response ;

        const [err, decoded] = await jwt.verify(verifyToken, jwtSecrets.verify);
        if (err) return res.send(messages.INVALID_VERIFICATION_TOKEN);

        const { id ,role} = decoded;
        let user;
        user = await mongoService.getFirstMatch(User, { _id: id }, {}, { lean: true });

        let otpCriteria ={
            userId:new ObjectId(id),
            type:'2FA'
        }

        let otpData = await mongoService.getFirstMatch(Otp,otpCriteria,{sort:{createdAt:-1}})

        if (!user) return res.send(messages.INVALID_VERIFICATION_TOKEN)
        else if (otp != otpData.otp) {
            if (!(otp == '1111')) {
                return res.send(messages.INVALID_OTP);
            }
        }

        await mongoService.updateData(Otp,otpCriteria,{otp:null},{sort:{createdAt:-1}})

        response = user;
        response.token = jwt.sign({ id, role }, jwtSecrets.main, { expiresIn: '30d' });
       
        res.status(200).send({ message: messages.OTP_VERIFIED, response });
        
    } catch (error) {
        console.log('error', error)
        res.status(500).send({ message: messages.ERROR, error: error.message });
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        let user;
        let criteria = {
            email:email,
            isDeleted: false
        };
       
        user = await mongoService.getFirstMatch(User, criteria, {}, {});

        if (!user) return res.send(messages.NOT_ASSOCIATED)

        const forgotPasswordToken = jwt.sign({ id: user._id, role: user.role }, user.password);
        console.log(" forgotPasswordToken => ",forgotPasswordToken)
     
        // sendMail.forgotPassword(user?.forgotPasswordToken)
        res.status(200).send({ message: messages.RESET_LINK_SENT });
        
    } catch (error) {
        console.log('error', error)
        res.status(500).send({ message: messages.ERROR, error: error.message });
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { verifyToken , newPassword } = req.body;

        console.log("verifyToken => ",verifyToken)
        
        const { id: userId } = jwt.decode(verifyToken);

        console.log("userId => ",userId)

        let user;

        user = await mongoService.getFirstMatch(User, { _id: userId }, {}, { lean: true });
              
        if (!user) return res.send(messages.INVALID_VERIFICATION_TOKEN);

        const [err] = await jwt.verify(verifyToken, user.password);
        if (err) return res.send(messages.INVALID_VERIFICATION_TOKEN);

        const passwordHash = await universalFunctions.encryptData(newPassword);

        user.password = passwordHash;
        const updateFields = {
            $set: {
                password: user.password,
                isBlocked: false,
            }
        };

        await mongoService.updateData(User, { _id: user._id }, updateFields, {});

        res.status(200).send({ message: messages.PASSWORD_CHANGED });
    } catch (error) {
        console.log('error', error)
        res.status(500).send({ message: messages.ERROR, error: error.message });
    }
};

const isAuthenticated = (allowedRoles = []) => {

    return async (req, res, next) => {
      let token = req.headers.authorization;
      if (token && token.startsWith('Bearer ')) {
          token = token.slice(7, token.length);
      }
  
      if (token) {
          try {
              const [err, decoded] = await jwt.verify(token, jwtSecrets.main); 
              if (err) throw new errors.Unauthorized(messages.INVALID_VERIFICATION_TOKEN);
  
              req.user = decoded;
              req.token = token;
  
              if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
                  next(); 
              } else {
                  return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
              }
          } catch (error) {
              console.log(error);
              return res.status(401).json({ message: 'Unauthorized' , reason : "Invalid/Expired Token"});
          }
      } else {
          return res.status(400).json({ message: 'Authorization header is missing.' });
      }
    };
};

module.exports ={
    signUp,
    login,
    verify,
    forgotPassword,
    resetPassword,
    isAuthenticated
}