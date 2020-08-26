const mongoose= require('mongoose');

const forgotpwdSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token:{
        type:String
    },
    isValid:{
        type:Boolean
    }
},
{
    timestamps:true
});


const ForgotPassword=mongoose.model('ForgotPassword',forgotpwdSchema) ;
module.exports=ForgotPassword;