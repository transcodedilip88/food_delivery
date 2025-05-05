const mongoose = require('mongoose') 

  const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default:null},
    deliveryAddress: { 
        label: { type: String, default: "Home"},
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        location: {
            type:{type:String,enum:['Point']},
            coordinates:{type:[Number]}
        }
    },
    items: [{ 
        name: {type:String},
        price: {type:Number},
        quantity: {type:Number}
    }],
    status: {type: String,enum: ['pending', 'confirmed','out_for_delivery', 'delivered', 'cancelled'],default: 'pending'},
    paymentInfo: {
        method: { type: String, enum: ['online'],default:'online'},
        status: { type: String, enum: ['paid', 'failed'], default: 'paid' },
        transactionId: {type:String},
    },
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});
  
module.exports = mongoose.model('Order', OrderSchema);
  