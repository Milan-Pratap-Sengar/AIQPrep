import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { ProfilePhotoSelector } from "../../components/inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/Helper";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/AxiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import uploadImage from "../../utils/UploadImage";
import Spinner from "../../components/loader/SpinnerLoader";




export default function SignUp({setCurrentPage}){

    const [profilePic,setProfilePic]=useState(null)
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("")
    const [error,setError]=useState(null)
    const [loading,setLoading]=useState(false);

    const {user}=useContext(UserContext)
    const navigate=useNavigate();

    const handleSignup=async (e)=>{
        e.preventDefault();

        let profileImageUrl="";

        if(!fullName){
            setError("Please Enter your Full Name.");
            return;
        }

        if(!validateEmail(email)){
            setError("Please Enter the valid Email.")
            return;
        }
        if(!password){
            setError("Please Enter your Password");
            return;
        }

        setError("");

        setLoading(true);

        try{
            // Signup API call
            if(profilePic){
                const imgUploadRes= await uploadImage(profilePic)
                profileImageUrl=imgUploadRes.imageUrl || ""
            }

            const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER, {name:fullName,email,password,profileImageUrl})

            const {token}=response.data
            console.log("The Token is ",token)
            if(token){
                localStorage.setItem("token",token)
                updateUser(response.data)
                navigate("/dashboard")
            }
        }
        catch(err){
            if(err.response && err.response.data.message){
                setError(err.response.data.message);
            }
            else{
                setError("Something went wrong. Please try again later")
            }
        }

        setLoading(false)
    }

    return (
        <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center ">
            <h3 className="text-lg font-semibold text-black">Create an Account</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below.</p>

            <form onSubmit={handleSignup}>

                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                    <Input value={fullName} onChange={({target})=>setFullName(target.value)} label={"Full Name"} placeholder={"John"} type={"text"}/>
                    <Input value={email} onChange={({target})=>setEmail(target.value)} label={"Email Address"} placeholder={"John@example.com"} type={"text"}/>
                    <Input value={password} onChange={({target})=>setPassword(target.value)} label={"Password"} placeholder={"Min 8 Characters"} type={"password"}/>
                </div>
                {
                    error && <p className="text-red-500 text-xs pb-2.5 ">{error}</p>
                }

                <button type="submit" className="btn-primary" disabled={loading}>
                    {
                        loading ? <Spinner/> : "SIGN UP"
                    }
                </button>

                <p className="text-[13px] text-slate-800 mt-3 ">
                    Already have an account ? {" "}
                    <button className="font-medium text-primary underline cursor-pointer" onClick={()=>setCurrentPage("login")}>Login</button>
                </p>
            </form>
        </div>
    )
}