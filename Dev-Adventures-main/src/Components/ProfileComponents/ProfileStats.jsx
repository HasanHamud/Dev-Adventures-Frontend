import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faTrophy } from "@fortawesome/free-solid-svg-icons";

function ProfileStats() {
  const stats = [
    { label: "Courses", value: 0, icon: faGraduationCap },
    { label: "Achievements", value: 3, icon: faTrophy }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-700 p-4 flex items-center space-x-4 rounded-lg">
          <div className=" p-2 bg-blue-500 rounded-full text-center">
            <p> <FontAwesomeIcon icon={stat.icon} className="text-white h-5 w-" /> </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;
