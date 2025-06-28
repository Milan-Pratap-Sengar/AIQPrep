import { useRef, useState } from "react"
import {LuUser, LuUpload, LuTrash} from "react-icons/lu"


export function ProfilePhotoSelector({image,setImage, preview, setPreview}){

    const inputRef=useRef(null)
    const [previewUrl,setPreviewUrl]=useState(null)

    const handleImageChange=(event)=>{
        const file=event.target.files[0];
        if(file){
            // update the image state
            setImage(file) // to store the image in a variable using useState();
        }

        // Generate preview URL from the file
        const preview=URL.createObjectURL(file) // to create the image URL so that it can be used in "src" attribute of <img/> tag to preview.
        console.log("The preview is ",preview)
        if(setPreview){
            setPreview(preview)
        }
        setPreviewUrl(preview)
    }

    const handleRemoveImage=()=>{
        setImage(null)
        setPreviewUrl(null)

        if(setPreview){
            setPreview(null)
        }
    }


    // to select the image from your PC
    const onChooseFile=()=>{
        inputRef.current.click();
    }

    return (
        <div className="flex justify-center mb-6">
            <input className="hidden" type="file" accept="image/*" ref={inputRef} onChange={handleImageChange}/>
            {
                !image ?
                (
                    <div className="w-20 h-20 flex items-center justify-center bg-orange-50 rounded-full relative cursor-pointer">
                        <LuUser className="text-4xl text-orange-500"/>
                        <button type="button" onClick={onChooseFile} className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-orange-500/85 to-orange-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer">
                            <LuUpload/>
                        </button>
                    </div>
                ) :
                (
                    <div className="relative">
                        <img src={preview || previewUrl} alt="Profile Photo" className="w-20 h-20 rounded-full object-cover"/>
                        <button type="button" onClick={handleRemoveImage} className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer">
                            <LuTrash/>
                        </button>
                    </div>
                )
            }
        </div>
    )
}