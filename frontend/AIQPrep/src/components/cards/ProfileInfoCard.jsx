import { use, useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"


export default function ProfileInfoCard(){

    const {user,clearUser}=useContext(UserContext)
    const navigate=useNavigate()

    const profileImageUrl=user?.userDetails?.profileImageUrl
    const userName=user?.userDetails?.name;

    const handleLogout=()=>{
        localStorage.clear();
        clearUser()
        navigate("/")
    }

    // console.log(user.userDetails)
    return (
        user && (
            <div className="flex items-center">
                <img src={profileImageUrl} alt="profileImg" className="w-11 h-11 bg-gray-300 rounded-full mr-3 "/>
                <div>
                    <div className="text-[15px] text-black font-bold leading-3">{userName}</div>
                    <button className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        )
    )
}