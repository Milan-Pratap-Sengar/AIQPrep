const mongoose=require("mongoose");

const dbConnect= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{});
        console.log("Database is connected Successfully");
    }
    catch(err){
        console.log("Error Occurred while connecting to DB :",err)
        process.exit(1)
    }
}

module.exports=dbConnect

