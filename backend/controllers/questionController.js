const Question=require("../models/Question");
const Session = require("../models/Session");


// *************************************************************** addQuestionsToSessions **********************************************************

const addQuestionsToSessions=async (req, res)=>{
    try{
        const {sessionId, questions}=req.body;

        if(!sessionId || !questions || !Array.isArray(questions)){
            return res.status(400).json({
                success:false,
                message:"Invalid Input data"
            })
        }

        const session=await Session.findById(sessionId)

        if(!session){
            return res.status(400).json({
                success:false,
                message:"Session not Found."
            })
        }

        const createdQuestions=await Question.insertMany(
            questions.map((q)=>({
                session:sessionId,
                question:q.question,
                answer:q.answer
            }))
        )

        session.questions.push(...createdQuestions.map((q)=>q._id))
        await session.save();

        return res.status(200).json({
            success:true,
            message:"Questions added Successfully.",
            createdQuestions
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while adding questions to Session."
        })
    }
}


// *************************************************************** togglePinQuestion **********************************************************

const togglePinQuestion=async (req, res)=>{
    try{
        const questionId=req.params.id;

        const question=await Question.findById(questionId)
        if(!question){
            return res.status(400).json({
                success:false,
                message:"Question not Found."
            })
        }

        question.isPinned= !question.isPinned
        await question.save()

        return res.status(200).json({
            success:true,
            message:"Question toggled Successfully.",
            question
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while toggle pin question."
        })
    }
}


// *************************************************************** updateQuestionNote **********************************************************
const updateQuestionNote=async (req, res)=>{
    try{
        const {note}=req.body;
        const questionId=req.params.id;
        const question=await Question.findById(questionId)

        if(!question){
            return res.status(400).json({
                success:false,
                message:"Question not Found."
            })
        }
        question.note=note || ""
        await question.save()

        return res.status(200).json({
            success:true,
            message:"Note updated Successfully.",
            question
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while updating question note."
        })
    }
}


module.exports= {addQuestionsToSessions,togglePinQuestion,updateQuestionNote}