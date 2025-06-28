import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import moment from "moment"
import RoleInfoHeader from "./components/RoleInfoHeader"
import { LuCircleAlert,LuListCollapse } from "react-icons/lu"
import {motion, AnimatePresence} from "framer-motion"
import Spinner from "../../components/loader/SpinnerLoader"
import {toast} from "react-hot-toast"
import axiosInstance from "../../utils/AxiosInstance"
import { API_PATHS } from "../../utils/ApiPaths"
import QuestionCard from "../../components/cards/QuestionCard"
import AiResponsePreview from "./components/AiResponsePreview"
import Drawer from "../../components/Drawer"

export default function InterviewPrep(){

    const {sessionId}=useParams()
    const [sessionData,setSessionData]=useState(null)
    const [error,setError]=useState("")
    const [openLearnMore,setOpenLearnMore]=useState(false)
    const [explaination,setExplaination]=useState(null)
    const [loading,setLoading]=useState(false)
    const [isUpdateLoader,setIsUpdateLoader]= useState(false)

    // fetch session data
    const fetchSessionData=async()=>{
        try{
            const response=await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId))
            console.log("Fetch Session Data API success....",response.data)
            if(response.data && response.data.sessionDetails){
                setSessionData(response.data.sessionDetails)
            }
        }
        catch(err){
            console.log("Fetch Session Data API Error....",err)
        }
    }

    // generate concept Explaination
    const generateConceptExplaination=async(question)=>{
        setLoading(true)
        try{            
            setError("")
            setExplaination(null)
            setLoading(true)
            setOpenLearnMore(true)

            const response=await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLAINATION,{question})

            console.log(response.data.data)
            if(response.data.data){
                setExplaination(response.data.data)
            }
        }
        catch(err){
            console.log("GenerateConceptExplaination API Error....",err)
            setError("Failed to generate Explaination, Try again later.")
        }
        setLoading(false)
    }

    // pin question
    const pinQuestion=async(questionId)=>{
        try{
            const response=await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))
            console.log(response.data.question);

            if(response.data && response.data.question){
                fetchSessionData()
            }

        }
        catch(err){
            console.log("Pin Question API Error....",err)
        }
    }

    // add more questions to session
    const uploadMoreQuestions=async()=>{
        try{
            setIsUpdateLoader(true)

            const aiResponse=await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,{role: sessionData?.role, experience:sessionData?.experience, topicsToFocus:sessionData?.topicsToFocus, numberOfQuestions:10})
            console.log("airesponse is",aiResponse)
            const generatedQuestions=aiResponse.data.data
            const response=await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION,{sessionId,questions:generatedQuestions})
            console.log(response.data)
            if(response.data){
                toast.success("Added More Q&A!!")
                fetchSessionData( )
            }
        }
        catch(err){
            console.log("Upload More Questions API Error....",err)
            if(err.response && err.response.data.message){
                setError(err.response.data.message)
            }
            else{
                setError("Something went wrong. Please try again later")
            }
        }
        setIsUpdateLoader(false)
    }

    useEffect(()=>{
        if(sessionId){
            fetchSessionData()
        }
        return ()=>{}
    },[])


    return (
        <DashboardLayout>
            <RoleInfoHeader
                role={sessionData?.role || ""}
                topicsToFocus={sessionData?.topicsToFocus || ""}
                experience={sessionData?.experience || ""}
                questions={sessionData?.questions?.length || "-"}
                description={sessionData?.description || ""}
                lastUpdated={
                    sessionData?.updatedAt ? moment(sessionData?.updatedAt).format("Do MMM YYYY") : ""
                }

            />

            <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
                <h2 className="text-lg font-semibold color-black">Interview Q&A</h2>

                <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
                    <div className={`col-span-12 ${openLearnMore ? "md:col-span-7" : "md:col-span-8"}`}>
                        <AnimatePresence>
                            {
                                sessionData?.questions?.map((data,index)=>(
                                    <motion.div 
                                        key={data._id || index} 
                                        initial={{opacity:0,y:-20}}
                                        animate={{opacity:1,y:0}}
                                        exit={{opacity:0,scale:0.95}}
                                        transition={{duration:0.4, type:"spring" , stiffness:100, delay:index*0.1 , damping:15}}
                                        layout //this is the key prop that animates position changes 
                                        layoutId={`questions-${data._id || index}`} //helps framer to track specific items
                                    >
                                        <>
                                            <QuestionCard
                                                question={data?.question}
                                                answer={data?.answer}
                                                onLearnMore={()=>generateConceptExplaination(data?.question)}
                                                isPinned={data?.isPinned}
                                                onTogglePin={()=>pinQuestion(data._id )}
                                            />
                                        {
                                            !loading && sessionData?.questions?.length == index+1 && (
                                                <div className="flex items-center justify-center mt-5">
                                                    <button disabled={isUpdateLoader} onClick={uploadMoreQuestions} className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer">
                                                        {
                                                            isUpdateLoader ? 
                                                            (<Spinner/>) :
                                                            (<LuListCollapse className="text-lg"/>)
                                                        }
                                                        {" "}
                                                        Load More 
                                                    </button>
                                                </div>
                                            )
                                        }
                                        </>
                                    </motion.div>
                                ))
                            }
                        </AnimatePresence>
                    </div>
                </div>

                <div>
                    <Drawer
                        isOpen={openLearnMore}
                        onClose={()=>setOpenLearnMore(false)}
                        title={!loading && explaination?.title}
                    >
                        {
                            error && (
                                <p className="flex gap-2 text-sm text-amber-600 font-medium">
                                    <LuCircleAlert className="mt-1"/>
                                    {error}
                                </p>
                            )
                        }
                        {
                            loading && (<Spinner/>)
                        }
                        {
                            !loading && explaination && (
                                <AiResponsePreview content={explaination?.explanation}/>
                            )
                        }
                    </Drawer>
                </div>
            </div>
        </DashboardLayout>
    )
}