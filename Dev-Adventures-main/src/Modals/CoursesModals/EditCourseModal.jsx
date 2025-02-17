/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-base font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const EditCourseModal = ({
  isOpen,
  onClose,
  onCourseUpdated = () => {},
  course = {},
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const BACKEND_URL = "http://localhost:5101";

  useEffect(() => {
    if (course) {
      setFormData(course);
      if (course.imgURL) {
        setImagePreview(
          course.imgURL.startsWith("http")
            ? course.imgURL
            : `${BACKEND_URL}${course.imgURL}`
        );
      }
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("Title", formData.title);
      formDataToSubmit.append("Description", formData.description);
      formDataToSubmit.append("Rating", formData.rating);
      formDataToSubmit.append("Price", formData.price);
      formDataToSubmit.append("Status", formData.status);
      formDataToSubmit.append("Duration", formData.duration);
      formDataToSubmit.append("Level", formData.level);
      formDataToSubmit.append("Language", formData.language);

      // Only append ImgURL if a new image file is selected
      if (imageFile) {
        formDataToSubmit.append("ImgURL", imageFile);
      }

      const response = await axios.put(
        `http://localhost:5101/api/Courses/${course.id}`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      enqueueSnackbar("Course updated successfully!", {
        variant: "success",
        autoHideDuration: 3000,
      });
      onClose();
      if (onCourseUpdated) {
        onCourseUpdated(response.data);
      }
    } catch (error) {
      console.error("Full error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the course.";
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
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

      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-750">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-white font-semibold">Update Course</h2>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-grow"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Title">
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-base"
                placeholder="Enter title"
                disabled={isLoading}
                required
              />
            </FormField>

            <FormField label="Language">
              <input
                type="text"
                name="language"
                value={formData.language || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-base"
                placeholder="Enter language"
                disabled={isLoading}
                required
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-base min-h-[120px]"
              placeholder="Enter description"
              disabled={isLoading}
              required
            />
          </FormField>

          <FormField label="Course Image">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base"
              disabled={isLoading}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Course Preview"
                className="max-w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-48 bg-gray-700 text-gray-400 rounded-md">
                No Image Available
              </div>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Rating">
              <input
                type="number"
                name="rating"
                value={formData.rating || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-base"
                placeholder="0-10"
                min="0"
                max="10"
                disabled={isLoading}
                required
              />
            </FormField>

            <FormField label="Price">
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-base"
                placeholder="Enter price"
                min="-1"
                disabled={isLoading}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base"
                disabled={isLoading}
              >
                <option value="Published">Published</option>
                <option value="InProgress">In Progress</option>
              </select>
            </FormField>

            <FormField label="Level">
              <select
                name="level"
                value={formData.level || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base"
                disabled={isLoading}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </FormField>
          </div>

          <FormField label="Duration (hours)">
            <input
              type="number"
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-base"
              placeholder="Enter duration"
              min="0"
              disabled={isLoading}
              required
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-base text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-base text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

EditCourseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCourseUpdated: PropTypes.func,
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    rating: PropTypes.number,
    price: PropTypes.number,
    status: PropTypes.string,
    duration: PropTypes.number,
    level: PropTypes.string,
    language: PropTypes.string,
    imgURL: PropTypes.string,
  }),
};

export default EditCourseModal;
