import { Children, createContext, use, useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { API_PATHS } from "../utils/ApiPaths";



export const UserContext= createContext();

const UserProvider = ({children}) => {

    const [user,setUser] = useState(null)
    const [loading,setLoading] =useState(true)

    useEffect(()=>{
        if(user){
            return
        }

        const accessToken = localStorage.getItem("token")
        if(!accessToken){
            setLoading(false)
            return
        }

        const fetchUser = async ()=>{
            try{
                const response=await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
                setUser(response.data)
            }
            catch(err){
                console.log("User not Authenticated ",err)
                clearUser()
            }
            finally{
                setLoading(false)
            }
        }

        fetchUser();
    },[])

    const updateUser=(userData)=>{
        setUser(userData)
        localStorage.setItem("token",userData.token)
        setLoading(false)
    }

    const clearUser= ()=>{
        setUser(null)
        localStorage.removeItem("token")
    }

    return (
        <UserContext.Provider value={{user , loading , updateUser, clearUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider