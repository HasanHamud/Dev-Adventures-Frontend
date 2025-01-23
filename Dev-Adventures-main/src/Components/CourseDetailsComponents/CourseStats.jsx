import { useLocation } from "react-router";

export const CourseStats = () => {
  const { state } = useLocation();
  const courseData = state?.courseData;

  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {[
        { icon: "⏱", label: "Duration", value: "120 Hours" },
        { icon: "📚", label: "Lessons", value: "12 Total" },
        {
          icon: "🌐",
          label: "Language",
          value: courseData?.language || "C++",
        },
      ].map((stat, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-gray-400">{stat.icon}</span>
            <div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
              <div className="text-white font-medium">{stat.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
