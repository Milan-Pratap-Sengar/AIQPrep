const Session=require("../models/Session")
const Question=require("../models/Question")



// *************************************************************** Create Session **********************************************************

const createSession=async (req, res)=>{
    try{
        const {role,experience,topicsToFocus,description,questions}=req.body
        const userId=req.user.id;
        
        const session=await Session.create({user:userId,role,experience,topicsToFocus,description})

        // questions.map(...) returns an array of promises (because the callback is async), 
        // Promise.all(...) waits for all of them to complete.
        // Once all documents are created, it resolves to an array of their _ids.
        const questionDocs=await Promise.all(
            questions.map(async (q)=>{
                const question=await Question.create({
                    session:session._id,
                    question:q.question,
                    answer:q.answer
                })
                return question._id
            })
        )

        session.questions=questionDocs
        await session.save();

        return res.status(200).json({
            success:true,
            message:"Session created Successfully.",
            session
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while creating Session.",
            err:err.message
        })
    }
}



// *************************************************************** Get Session By Id **********************************************************

const getSessionById=async (req, res)=>{
    try{
        const sessionId=req.params.id
        const sessionDetails=await Session.findById(sessionId).populate({
                                                                            path:"questions",
                                                                            options:{sort:{isPinned:-1, createdAt:1}}
                                                                        }).exec()

        if(!sessionDetails){
            return res.status(400).json({
                success:false,
                message:"Session not Found."
            })
        }

        return res.status(200).json({
            success:true,
            message:"Session Fetched Successfully.",
            sessionDetails
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching Session details.",
            err:err.message
        })
    }
}


// *************************************************************** getMySessions **********************************************************

const getMySessions=async (req, res)=>{
    try{
        const userId=req.user.id;
        
        const sessions=await Session.find({user:userId}).sort({createdAt:-1}).populate("questions")

        return res.status(200).json({
            success:true,
            message:"All Sessions Fetched Successfully.",
            sessions
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching all the Sessions.",
            err:err.message
        })
    }
}


// *************************************************************** delete Session **********************************************************

const deleteSession=async (req, res)=>{
    try{
        const sessionId=req.params.id

        const session=await Session.findById(sessionId)

        if(!session){
            return res.status(400).json({
                success:false,
                message:"Session not Found."
            })
        }

        // check if login user owns this session
        if(session.user.toString() !== req.user.id){
            return res.status(400).json({
                success:false,
                message:"Not Authorized to delete this Session."
            })
        }

        // delete all questions related to this session
        await Question.deleteMany({session:session._id})

        await session.deleteOne()

        return res.status(200).json({
            success:true,
            message:"Session deleted Successfully."
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while deleting Session.",
            err:err.message
        })
    }
}

module.exports ={createSession,getSessionById,getMySessions,deleteSession}