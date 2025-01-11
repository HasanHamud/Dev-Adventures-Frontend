import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa"; // Importing icons from react-icons

function ProfileTabs() {
  const tabs = [
    { name: "Information", active: true },
    { name: "Settings", active: false }
  ];

  const information = [
    { label: "Full Name", value: "John Doe", icon: <FaUser className="h-5 w-5" /> },
    { label: "Email", value: "johndoe@email.com", icon: <FaEnvelope className="h-5 w-5" /> },
    { label: "Phone Number", value: "+123 456 7890", icon: <FaPhone className="h-5 w-5" /> }
  ];

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex space-x-6 border-b border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 ${tab.active ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-300 hover:text-white"}`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <div className="space-y-4 max-w-xl mx-auto">
          {information.map((info, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
              <div className="text-white">
                {info.icon} {/* Icon displayed here */}
              </div>
              <div>
                <p className="text-sm text-gray-400">{info.label}</p>
                <p className="font-medium text-white">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileTabs;
