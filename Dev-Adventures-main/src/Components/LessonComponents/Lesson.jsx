import { useState } from "react";
import { Lock, Clock, CheckCircle } from "lucide-react";

export default function Lesson({ number, status = "locked" }) {
  const [hover, setHover] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="absolute bottom-2 right-2 w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="absolute bottom-2 right-2 w-5 h-5 text-blue-500" />;
      case "locked":
        return <Lock className="absolute bottom-2 right-2 w-5 h-5 text-gray-600" />;
        
    }
  };

  const getBgColor = () => {
    switch (status) {
      case "completed":
      case "in_progress":
        return "bg-gray-800";
      default:
        return "bg-gray-900";
    }
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`w-40 h-32 rounded-lg ${getBgColor()} flex items-center justify-center hover:bg-gray-800 relative hover:shadow-[inset_0_0_30px_rgba(30,100,246,0.5)] transition-shadow duration-300`}
      >
        <span className="text-2xl font-bold text-white">{number}</span>
        {getStatusIcon()}
      </button>
      
      {hover && (
        <div className="absolute z-10 bg-gray-800 text-white p-4 rounded shadow-lg top-full mt-2 w-48">
          <p className="font-medium mb-2">Lesson {number}</p>
          <p className="text-gray-400 text-sm mb-1">Length: 20 minutes</p>
          <p className="text-gray-400 text-sm">Status: {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}</p>
        </div>
      )}
    </div>
  );
};