import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaPencilAlt } from "react-icons/fa";

const ProfileTabs = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editState, setEditState] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
  });
  const [editValues, setEditValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const tabs = [{ name: "Information", active: true }];

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      console.log("Loaded from localStorage:", parsedData);

      const newUserData = {
        id: parsedData.id,
        fullName: parsedData.fullName || "Full Name Not Provided",
        email: parsedData.email || "Email Not Provided",
        phoneNumber: parsedData.phoneNumber || "Phone Number Not Provided",
      };

      setUserData(newUserData);
      setEditValues(newUserData);
      setLoading(false);
    } else {
      console.log("No data found in localStorage, fetching from API.");
    }

    const fetchUserData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (!storedData?.id) throw new Error("User ID not found");

        const response = await axios.get(
          `http://localhost:5101/api/Profile/${storedData.id}`
        );

        const newUserData = {
          id: response.data.id,
          fullName: response.data.fullname,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        };

        setUserData(newUserData);
        setEditValues(newUserData);
        setError(null);

        localStorage.setItem("userData", JSON.stringify(newUserData));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (field) => {
    setEditState((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async (field) => {
    try {
      const storedData = JSON.parse(localStorage.getItem("userData"));

      const requestBody = {
        id: storedData.id,
        fullname:
          field === "fullName" ? editValues.fullName : userData.fullName,
        email: field === "email" ? editValues.email : userData.email,
        phoneNumber:
          field === "phoneNumber"
            ? editValues.phoneNumber
            : userData.phoneNumber,
        profileImage: userData.profileImage || "default-profile.png",
      };

      const response = await axios.put(
        `http://localhost:5101/api/Profile/${storedData.id}`,
        requestBody
      );
      console.log("Updated API Response:", response.data);

      const updatedUserData = {
        id: response.data.id,
        fullName: response.data.fullname,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        profileImage: response.data.profileImage,
      };

      setUserData(updatedUserData);
      setEditValues(updatedUserData);
      setEditState((prev) => ({ ...prev, [field]: false }));

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: response.data.id,
          fullName: response.data.fullname,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          profileImage: response.data.profileImage,
        })
      );
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "UnAuthorized to Update Your profile. Please Contact the admin or the owner."
      );
      setEditValues((prev) => ({ ...prev, [field]: userData[field] }));
    }
  };

  const handleCancel = (field) => {
    setEditState((prev) => ({ ...prev, [field]: false }));
    setEditValues((prev) => ({ ...prev, [field]: userData[field] }));
  };

  const information = userData
    ? [
        {
          label: "Full Name",
          value: userData.fullName,
          field: "fullName",
          icon: <FaUser className="h-5 w-5" />,
        },
        {
          label: "Email",
          value: userData.email,
          field: "email",
          icon: <FaEnvelope className="h-5 w-5" />,
        },
        {
          label: "Phone Number",
          value: userData.phoneNumber,
          field: "phoneNumber",
          icon: <FaPhone className="h-5 w-5" />,
        },
      ]
    : [];

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex space-x-6 border-b border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 ${
              tab.active
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="space-y-4 max-w-xl mx-auto">
            {information.map((info, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-white">{info.icon}</div>
                  <div>
                    <p className="text-sm text-gray-400">{info.label}</p>
                    {editState[info.field] ? (
                      <input
                        type="text"
                        value={editValues[info.field]}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            [info.field]: e.target.value,
                          }))
                        }
                        className="bg-gray-600 text-white px-2 py-1 rounded mt-1"
                      />
                    ) : (
                      <p className="font-medium text-white">{info.value}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {editState[info.field] ? (
                    <>
                      <button
                        onClick={() => handleSave(info.field)}
                        className="text-blue-500 hover:text-blue-400 px-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancel(info.field)}
                        className="text-red-500 hover:text-red-400 px-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(info.field)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      <FaPencilAlt className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
