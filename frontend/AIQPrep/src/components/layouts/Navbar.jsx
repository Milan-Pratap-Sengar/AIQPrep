import { NavLink } from "react-router-dom";
import ProfileInfoCard from "../cards/ProfileInfoCard";

export default function Navbar(){
    return (
        <div className="h-16 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30">
            <div className="container mx-auto flex items-center justify-between gap-5 pl-6 pr-6">
                <NavLink to="/dashboard">
                    <h1 className="text-4xl md:text-xl text-black leading-5 font-bold">AIQPrep</h1>
                </NavLink>

                <ProfileInfoCard/>
            </div>
        </div>
    )
}