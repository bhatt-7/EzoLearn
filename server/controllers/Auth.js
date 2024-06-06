//sendotp

const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require("../models/Profile");
require('dotenv').config();

exports.sendOTP = async(req,res)=>{
    
    try{

        const {email}= req.body;

        const chechUserPresent = await User.findOne({email});

        if(chechUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already Exists"
            })
        }

        //generateotp
        var otp =  otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAplhabets:false,
            specialChars:false
        });
        console.log("OTP Generated:",otp);

        //check unique otp

        var result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAplhabets:false,
                specialChars:false
            });

            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email,otp};

        // entry in db

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:'otp sent successfully',
            otp,
        })

    }
    catch(e){
         console.log(err);
         res.status(500).json({
            success:false,
            message:err.message,
         })
    }


} 


//signup

exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;
		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		// Create the Additional Profile For User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});
		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};

//login
exports.login = async(req,res)=>{
    try{
        //get data from req body
        const {email,password} = req.body;

        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fielda are require "
            })
        }
        //user check exist or not 
        const user = await User.findOne({email}).populate("additionalDetails"); 
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }
        //generate JWT token
        if(await bcrypt.compare(password,user.password)){

            const payload={
                email : user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token = token;
            user.password = undefined;
        
        //create cookie

        const options={
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in"
        })}

        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Login Failure, plz try again',
        })
    }
};

//changepassword
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;
		console.log(req.body)
		
		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		// console.log(updatedUserDetails)
		// try {
		// 	const emailResponse = await mailSender(
		// 		updatedUserDetails.email,
		// 		passwordUpdated(
		// 			updatedUserDetails.email,
		// 			`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
		// 		)
		// 	);
		// 	console.log("Email sent successfully:", emailResponse.response);
		// } catch (error) {
		// 	// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
		// 	console.error("Error occurred while sending email:", error);
		// 	return res.status(500).json({
		// 		success: false,
		// 		message: "Error occurred while sending email",
		// 		error: error.message,
		// 	});
		// }

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};