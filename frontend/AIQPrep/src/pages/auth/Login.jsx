import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/Helper";
import axiosInstance from "../../utils/AxiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { UserContext } from "../../context/UserContext";
import Spinner from "../../components/loader/SpinnerLoader";


export default function Login({setCurrentPage}){

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [error,setError]=useState(null)
    const [loading,setLoading]=useState(false);
    const {updateUser} = useContext(UserContext)
    const navigate=useNavigate();

    const handleLogin= async (e)=>{
        e.preventDefault()

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
            console.log("on clicking login button")
            
            // login API Call
            const response= await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email,password})
            console.log("LOGIN API SUCCESSFUL RESPONSE.......................",response)
            const {token} = response.data
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

        setLoading(false);
    }

    return (
        <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center ">
            <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">Please Enter your Details to Login</p>
            <form onSubmit={handleLogin}>
                <Input value={email} label="Email Address" placeholder="john@example.com" type="text" onChange={({target}) => setEmail(target.value)}/>
                <Input value={password} label="Password" placeholder="Min 8 Characters" type="password" onChange={({target}) => setPassword(target.value)}/>

                {
                    error && <p className="text-red-500 text-xs pb-2.5 ">{error}</p>
                }
                <button type="submit" className="btn-primary" disabled={loading}>
                    {
                        loading ? <Spinner/> : "LOGIN"
                    }
                </button>

                <p className="text-[13px] text-slate-800 mt-3 ">
                    Don't have an Account? {" "}
                    <button onClick={()=>setCurrentPage("signup")} className="font-medium text-primary underline cursor-pointer" > SignUp </button>
                </p>
            </form>
        </div>
    )
}