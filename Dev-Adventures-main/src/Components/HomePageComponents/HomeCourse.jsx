/* eslint-disable react/prop-types */

import placeholder from "../../Assets/images/Placeholder.png"

export default function HomeCourse({text, text2}){

    return(
        <div className="flex flex-col bg-[#2a2a2a] rounded-xl w-80 h-72 shadow-md">
        <div className=" rounded-md ">
        <img src={placeholder} className="w-80 h-36 rounded-2xl"></img>
        </div>

        <div className="mt-5 text-center">
        <h1 className="text-lg text-white">
        {text}
        </h1>

        <h1 className="text-md text-gray-500">
        {text2}
        </h1>

        </div>
        </div>
    )
}