const jwt=require("jsonwebtoken")
const User=require("../models/User")

const protect=async (req,res,next)=>{
    try{
        let token=req.headers.authorization
        console.log(token);

        if(token && token.startsWith("Bearer")){
            token=token.split(" ")[1]; //   Extract Token
            const decoded= jwt.verify(token,process.env.JWT_SECRET)
            console.log(decoded)
            req.user=await User.findById(decoded.id).select("-password")
            next();
        }
        else{
            res.status(401).json({
                message:"Not Authorized, no token"
            })
        }
    }
    catch(err){
        res.status(401).json({
            message:"Token failed",
            err:err.message
        })
    }
}

module.exports={protect}


