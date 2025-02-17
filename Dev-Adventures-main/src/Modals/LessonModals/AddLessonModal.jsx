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

export const AddLessonModal = ({ courseId, isOpen, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const BASE_URL = "http://localhost:5101";

  console.log("Course ID:", courseId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      const lessonResponse = await axios.post(
        `${BASE_URL}/api/Lesson/courses/${courseId}`,
        {
          title: formData.title,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Lesson created successfully:", lessonResponse.data);

      onClose();
      enqueueSnackbar("Lesson created successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error Creating Lesson", { variant: "error" });
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold text-white mb-4">Add Lesson</h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Lesson Title">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Enter lesson title"
            />
          </FormField>

          {/* Lesson Description */}
          <FormField label="Lesson Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Enter lesson description"
            />
          </FormField>

          {/* Form Actions */}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
