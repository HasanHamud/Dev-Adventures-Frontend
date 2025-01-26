import { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { useLocation } from "react-router";
import { format } from "date-fns";
import { useSnackbar } from "notistack";

export const CourseSidebar = () => {
  const {enqueueSnackbar} = useSnackbar()
  const { state } = useLocation();
  const courseData = state?.courseData;
  const [requirements, setRequirements] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRequirement, setNewRequirement] = useState("");

  const AddtoCart = async (courseId) => {

    const token = localStorage.getItem('authToken'); 
    
    if (!token) {
      alert('Please login to add courses to cart');
     
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5101/api/Cart/Course/${courseId}`,
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      enqueueSnackbar("Added Course to your Cart!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Course Already exists", { variant: "error" });

    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`
        );

        if (Array.isArray(response.data)) {
          setRequirements(response.data);
        } else {
          console.warn(
            "Unexpected response format, setting requirements to empty array."
          );
          setRequirements([]);
        }
      } catch (error) {
        console.error("Error fetching requirements:", error);
        setRequirements([]);
      }
    };

    if (courseData?.id) {
      fetchRequirements();
    }
  }, [courseData]);

  const handleAddRequirement = async () => {
    if (newRequirement.trim()) {
      try {
        await axios.post(
          `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`,
          { description: newRequirement.trim() },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const response = await axios.get(
          `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`
        );
        setRequirements(response.data);

        setNewRequirement("");
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding requirement:", error);
      }
    }
  };

  return (
    <div className="fixed top-24 right-6 w-[calc(100%/3-32px)] max-w-md">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-lg font-semibold mb-4">
          Course Details
        </h2>

        {/* Course details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Level</span>
            <span className="text-white">
              {courseData?.level || "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Created</span>
            <span className="text-white">
              {formatDate(courseData?.createdDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Updated</span>
            <span className="text-white">
              {formatDate(courseData?.updatedDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Students</span>
            <span className="text-white">
              {courseData?.students || "Not specified"}
            </span>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Requirements</h3>
            <button
              className="h-6 w-6 rounded-full flex items-center justify-center bg-gray-700 text-blue-500 hover:bg-gray-600"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <ul>
            {requirements.map((req) => (
              <li key={req.id}>{req.description}</li>
            ))}
          </ul>
          {isAdding && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Enter new requirement"
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddRequirement}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewRequirement("");
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enroll Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
        onClick={() => AddtoCart(courseData.id)}
        
        >
          Enroll Now for ${courseData?.price || "99.99"}
        </button>
      </div>
    </div>
  );
};
