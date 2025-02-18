/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-base font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default function AddVideoModal({ courseId, lessonID, isOpen, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ Title: "", VideoURL: "", length });
  const BASE_URL = "http://localhost:5101";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      const videoResponse = await axios.post(
        `${BASE_URL}/api/Lesson/${courseId}/${lessonID}`,
        {
          Title: formData.Title,
          VideoURL: formData.VideoURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Video Added!");
      enqueueSnackbar("Video added to the lesson", { variant: "success" });
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error details:", error);
      enqueueSnackbar("Error Adding video", { variant: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold text-white mb-4">Add a Video</h2>
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

          <FormField label="Duration">
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Enter Video Duration"
            />
          </FormField>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 p-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
