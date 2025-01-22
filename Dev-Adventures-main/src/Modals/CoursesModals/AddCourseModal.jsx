/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const FormField = ({ label, children }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  const { enqueueSnackbar } = useSnackbar();
  const initialFormData = {
    title: "",
    description: "",
    rating: "",
    price: "",
    imgURL: "",
    status: "Published",
    duration: "" + " weeks",
    level: "Beginner",
    language: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "http://localhost:5101/api/Courses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message with persist option
      enqueueSnackbar("Course added successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        persist: true,
      });

      setFormData(initialFormData);
      onClose();
      if (onCourseAdded) {
        onCourseAdded(response.data);
      }

      // Delay reload to show the snackbar
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 seconds delay
    } catch (error) {
      const message =
        error.response?.data.message ||
        "An error occurred while adding the course.";
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 3000,
        persist: true,
      });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-750">
          <div className="flex justify-between items-center"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm"
                placeholder="Enter title"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Language">
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm"
                placeholder="Enter language"
                disabled={isLoading}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm min-h-[80px]"
              placeholder="Enter description"
              disabled={isLoading}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Rating">
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm"
                placeholder="0-10"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Price">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm"
                placeholder="Enter price"
                disabled={isLoading}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
                disabled={isLoading}
              >
                <option value="Published">Published</option>
                <option value="InProgress">In Progress</option>
              </select>
            </FormField>

            <FormField label="Level">
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
                disabled={isLoading}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (hours)">
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm"
                placeholder="Enter duration"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Image URL">
              <input
                type="text"
                name="imgURL"
                value={formData.imgURL}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-sm"
                placeholder="Enter URL"
                disabled={isLoading}
              />
            </FormField>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
