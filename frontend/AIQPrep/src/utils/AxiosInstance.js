import axios from "axios"
import { BASE_URL } from "./ApiPaths"

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:80000,
    headers:{
        "Content-Type":"application/json",
        Accept: "application/json"
    }
})


// Request Interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token")
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },

    (error)=>{
        return Promise.reject(error)
    }
)


// Response Interceptor
axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response){
            if(error.response.status === 400){
                window.location.href = "/"
            }
            else if(error.response.status === 500){
                console.log("Server Error. Please try again later.")
            }
            else if (error.code === "ECONNABORTED"){
                console.log("Request timeout. Please try again later.")
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance