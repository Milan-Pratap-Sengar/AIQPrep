const User= require("../models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
}


// *************************************************************** registerUser **********************************************************
const registerUser = async(req,res)=>{
    try{
        const {name,email,password,profileImageUrl}=req.body;

        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already Registered. Please Login."
            })
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const userDetails=await User.create({name,email,password:hashedPassword,profileImageUrl})

        return res.status(200).json({
            success:true,
            token:generateToken(userDetails._id),
            id: userDetails._id,
            name:userDetails.name,
            email:userDetails.email,
            profileImageUrl: userDetails.profileImageUrl,
            message:"User Registered Successfully."
        })

    }
    catch(err){
        console.log(err)
        res.status(401).json({
            success:false,
            message:"Can't register user. Please try again later.",
            err:err.message
        })
    }
}


// *************************************************************** registerUser **********************************************************
const loginUser = async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not Registered."
            })
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Please Enter correct Password."
            })
        }

        return res.status(200).json({
            success:true,
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        })


    }
    catch(err){
        res.status(401).json({
            success:false,
            message:"Can't Login. Please try again later.",
            err:err.message
        })
    }
}



// *************************************************************** registerUser **********************************************************
const getUserProfile = async(req,res)=>{
    try{
        const userId= req.user.id;
        const userDetails=await User.findById(userId).select("-password"); //.select("-password") is used to exclude the password
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"User Details fetched Successfully.",
            userDetails
        })
    }
    catch(err){
        res.status(401).json({
            success:false,
            message:"Can't fetch User Profile. Please try again later.",
            err:err.message
        })
    }
}


module.exports={registerUser,loginUser,getUserProfile}