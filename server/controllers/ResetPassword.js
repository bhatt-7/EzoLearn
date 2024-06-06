const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
exports.resetPasswordToken = async (req,res)=>{
   try{

         //get email
     const email = req.body.email;
     //check user for email
     const user = await User.findOne({email:email});
     if(!user){
         return res.json({success:false,
         message:"Your email is not registered with us"})
     }
     //generate token
     const token = crypto.randomUUID();
     //update user by adding token and expiration time
     const updatedDetails = await User.findOneAndUpdate({email:email},{
         token:token,
         resetPasswordExpires:Date.now()+5*60*1000,
     },{new:true});
     //create url
     const url = `http://localhost:3000/update-password/${token}`
     //sendmail
 
     await mailSender(email,"Password reset Link",`Password reset link: ${url}`)
 
     //return respinse
     return res.json({
         success:true,
         message:'Email sent Successfully, plz check email and changed password'
     })

   }
   catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"Something went wrong"
    })
   }
    
}

exports.resetPassword = async(req,res)=>{
    try{
        //data fetch
        const {password,confirmPassword, token} = req.body;
        //data validation
        if(confirmPassword !== password){
            return res.json({
                success:false,
                message:'Password not match'
            })
        }
        //get userdetails from db
        const userDetails = await User.findOne({token:token});
        //if not entry -> invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid"
            })
        }
        //token time
        if(!(userDetails.resetPasswordExpires > Date.now() )){
            return res.json({
                success:false,
                message:"Token is exipred plz regenerate"
            })
        }
        //hash password
        const encryptedPassword = await bcrypt.hash(password,10)
        //update password
        await User.findOneAndUpdate({token:token},{password:encryptedPassword},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Password changed"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Password not reset"
        })
    }
}