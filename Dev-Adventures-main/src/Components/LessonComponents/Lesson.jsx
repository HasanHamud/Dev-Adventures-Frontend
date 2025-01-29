/* eslint-disable react/prop-types */
export default function Lesson({ number }) {
  return (
    <div>
      <button className="w-20 h-20 rounded-full bg-[#4A7DFF] text-white text-xl font-bold flex items-center justify-center hover:bg-[#3D6AE8] transition-colors shadow-lg">
        {number}
      </button>
    </div>
  );
}
