import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import Spinner from "../../components/loader/SpinnerLoader";
import axiosInstance from "../../utils/AxiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";

function CreateSessionForm(){

    const [formData,setFormData]=useState({role:"", experience:"", topicsToFocus:"",description:""})
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    
    const navigate=useNavigate()

    const handleChange=(key,value)=>{
        setFormData((prevData)=>({
            ...prevData,
            [key]:value
        }))
    }

    const handleCreateSession=async(e)=>{
        e.preventDefault()

        const {role,experience,topicsToFocus}=formData

        if(!role || !experience || !topicsToFocus){
            setError("Please Fill all the Required Fields.")
            return;
        }
        setError("")

        setLoading(true)
        try{
            const aiResponse=await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,{role,experience,topicsToFocus,numberOfQuestions:10})
            console.log("Generate questions API...",aiResponse.data.data)
            const generatedQuestions=aiResponse.data.data
            console.log("Generated questions...",generatedQuestions)
            const response=await axiosInstance.post(API_PATHS.SESSION.CREATE,{
                ...formData,
                questions:generatedQuestions
            })
            console.log("response,",response)

            if(response?.data?.session?._id){
                navigate(`/interview-prep/${response?.data?.session?._id}`)
            }

        }
        catch(err){
            console.log("Create Session API Error.....",err)
            if(err.response && err.response.data.message){
                setError(err.response.data.message)
            }
            else{
                setError("Something went wrong. Please try again later.")
            }
        } 
        setLoading(false)
    }


    return (
        <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-black">Start a new Interview Journey</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-3">Fill out a few quick details and unlock your personalized set of Interview Questions!</p>
            <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
                <Input
                    value={formData.role}
                    onChange={({target})=>handleChange("role",target.value)}
                    label={"Target Role"}
                    placeholder={"(e.g., Frontend Developer, UI/UX Designer, etc.)"}
                    type={'text'}
                />

                <Input
                    value={formData.experience}
                    onChange={({target})=>handleChange("experience",target.value)}
                    label={"Years of Experience"}
                    placeholder={"(e.g., 1 year, 2 Years, 3 years, etc."}
                    type={'number'}
                />

                <Input
                    value={formData.topicsToFocus}
                    onChange={({target})=>handleChange("topicsToFocus",target.value)}
                    label={"Topics To Focus On"}
                    placeholder={"( Comma seperated, e.g.,React, Nodejs, MongoDB, etc."}
                    type={'text'}
                />

                <Input
                    value={formData.description}
                    onChange={({target})=>handleChange("description",target.value)}
                    label={"Description"}
                    placeholder={"Any Specific goals or notes for this session"}
                    type={'text'}
                />
                {
                    error && (<p className="text-red-500 text-xs pb-2.5 ">{error}</p>)
                }
                <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                    {
                        loading ? <Spinner/> : "Create Session"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateSessionForm;