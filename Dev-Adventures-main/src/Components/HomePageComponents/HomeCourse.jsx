/* eslint-disable react/prop-types */
import placeholder from "../../Assets/images/Placeholder.png";

export default function HomeCourse({ text, text2, imgUrl }) {
  return (
    <div className="flex flex-col bg-[#2a2a2a] rounded-xl w-80 h-72 shadow-md transition-all ease-in-out duration-100 hover:-translate-y-3">
      <div className="rounded-md">
        <img src={imgUrl || placeholder} className="w-80 h-36 rounded-2xl object-cover" alt={text} />
      </div>

      <div className="mt-5 text-center">
        <h1 className="text-lg text-white">{text}</h1>
        <h1 className="text-md text-gray-500">{text2}</h1>
      </div>
    </div>
  );
}