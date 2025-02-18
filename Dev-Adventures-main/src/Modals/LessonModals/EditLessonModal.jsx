/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
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

export default function EditLessonModal({
  courseId,
  lessonId,
  isOpen,
  onClose,
  onUpdate,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ Title: "", Description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = "http://localhost:5101"; // Make sure this is correct and matches your backend URL

  useEffect(() => {
    if (isOpen && lessonId) {
      fetchLessonDetails();
    }
  }, [isOpen, lessonId]);

  const fetchLessonDetails = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${BASE_URL}/api/lesson/courses/${courseId}/lesson/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Lesson details response:", response.data);

      setFormData({
        Title: response.data.Title || "",
        Description: response.data.Description || "",
      });
    } catch (error) {
      console.error("Error fetching Lesson details:", error);
      enqueueSnackbar("Error loading Lesson details", { variant: "error" });
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

    if (!formData.Title.trim() || !formData.Description.trim()) {
      enqueueSnackbar("Please fill all form fields", { variant: "error" });
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `${BASE_URL}/api/Lesson/${courseId}/${lessonId}`,
        {
          Title: formData.Title,
          Description: formData.Description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update successful:", response.data);
      enqueueSnackbar("Lesson Updated Successfully", { variant: "success" });

      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      enqueueSnackbar("Error updating lesson", { variant: "error" });
      console.error("Error occurred", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold text-white mb-4">Edit Lesson</h2>
        {isLoading ? (
          <div className="text-white text-center py-4">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormField label="Title">
              <input
                type="text"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Enter Lesson title"
              />
            </FormField>
            <FormField label="Description">
              <input
                type="text"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Enter Lesson Description"
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
                className="p-2 bg-green-500 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
