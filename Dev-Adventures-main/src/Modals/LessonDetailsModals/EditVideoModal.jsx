// EditVideoModal.jsx
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-base font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default function EditVideoModal({ courseId, lessonId, videoId, isOpen, onClose, onUpdate }) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ Title: "", VideoURL: "" });
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = "http://localhost:5101";

  useEffect(() => {
    if (isOpen && videoId) {
      fetchVideoDetails();
    }
  }, [isOpen, videoId]);

  const fetchVideoDetails = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${BASE_URL}/api/Lesson/${courseId}/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const video = response.data.find(v => v.id === videoId);
      if (video) {
        setFormData({
          Title: video.title,
          VideoURL: video.videoURL
        });
      } else {
        throw new Error("Video not found");
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
      enqueueSnackbar("Error loading video details", { variant: "error" });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Title.trim() || !formData.VideoURL.trim()) {
      enqueueSnackbar("Please fill all form fields", { variant: "error" });
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `${BASE_URL}/api/Lesson/${courseId}/${lessonId}/${videoId}`,
        {
          Title: formData.Title,
          VideoURL: formData.VideoURL
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Update successful:", response.data);
      enqueueSnackbar("Video Updated Successfully", { variant: "success" });

      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      enqueueSnackbar("Error updating video", { variant: "error" });
      console.error("Error occurred:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg w-1/3">
          <h2 className="text-2xl font-bold text-white mb-4">Edit Video</h2>
          {isLoading ? (
            <div className="text-white text-center py-4">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormField label="Video Title">
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter Video title"
                />
              </FormField>
              <FormField label="Video URL">
                <input
                  type="text"
                  name="VideoURL"
                  value={formData.VideoURL}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter Video URL"
                />
              </FormField>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 p-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-400"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
}