import { useState } from "react"

export default function Lesson({number}){
  const [hover, setHover] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-20 h-20 rounded-full bg-[#4A7DFF] text-white text-xl font-bold flex items-center justify-center hover:bg-[#3D6AE8] transition-colors shadow-lg border-4 border-blue-500 hover:border-white mb-5"
      >
        {number}
      </button>
      {hover && (
        <div className="absolute z-10 bg-gray-800 text-white p-4 rounded shadow-lg top-full mt-2 flex flex-col w-max">
        <p> Lesson  {number} </p> 
        <p> Length: 20 minutes</p>
        <p> Status: Incomplete</p>

        </div>
      )}
    </div>
  )
}