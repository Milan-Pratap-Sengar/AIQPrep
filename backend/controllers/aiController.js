const {GoogleGenAI} = require("@google/genai")
const {conceptExplainPrompt, questionAnswerPrompt}=require("../utils/prompts")

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})



// *************************************************************** generateInterviewQuestions **********************************************************

const generateInterviewQuestions = async (req, res)=>{
    try{
        const {role, experience, topicsToFocus,numberOfQuestions}=req.body;
        
        if(!role || !experience || !topicsToFocus || !numberOfQuestions){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }

        const prompt=questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions);

        const response=await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompt
        })

        let rawText=response.text;

        // remove ```json and ``` from beginning and end
        const cleanedText = rawText
                            .replace(/^```json\s*/,"") //remove starting ```json
                            .replace(/```$/,"") //remove ending ```
                            .trim() //remove extra spaces

        
        const data=JSON.parse(cleanedText)

        return res.status(200).json({
            success:true,
            data
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Something went wrong while generating Interview Questions."
        })
    }
}

// *************************************************************** generateConceptExplaination **********************************************************

const generateConceptExplaination = async (req, res)=>{
    try{
        const {question} = req.body;

        if(!question){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }

        const prompt=conceptExplainPrompt(question)
        
        const response=await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompt
        })

        let rawText=response.text;

        // remove ```json and ``` from beginning and end
        const cleanedText = rawText
                            .replace(/^```json\s*/,"") //remove starting ```json
                            .replace(/```$/,"") //remove ending ```
                            .trim() //remove extra spaces
                        
        const data=JSON.parse(cleanedText)

         return res.status(200).json({
            success:true,
            data
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Something went wrong while generating concept Explaination."
        })
    }
}


module.exports={generateInterviewQuestions,generateConceptExplaination}