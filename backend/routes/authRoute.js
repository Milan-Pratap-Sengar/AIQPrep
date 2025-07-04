const express = require("express");
const router=express.Router();
const {registerUser,loginUser,getUserProfile}=require("../controllers/authController")
const {protect} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,getUserProfile);


router.post("/upload-image",upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(401).json({
            message:"No File Uploaded."
        })
    }
    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.status(200).json({
        message:"File uploaded Successfully.",
        imageUrl 
    })
})

module.exports=router;