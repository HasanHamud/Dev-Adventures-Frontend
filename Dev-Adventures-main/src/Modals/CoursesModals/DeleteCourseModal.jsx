/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useSnackbar } from "notistack";

export function DeleteCourseModal({
  isOpen,
  onClose,
  courseName,
  courseId,
  onDeleteSuccess,
}) {
  const { enqueueSnackbar } = useSnackbar();

  async function deleteCourse() {
    console.log("course to delete", courseId);
    if (courseId) {
      try {
        const token = localStorage.getItem("authToken");

        await axios.delete(`http://localhost:5101/api/Courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        enqueueSnackbar("Course deleted successfully", {
          variant: "success",
          autoHideDuration: 3000,
          persist: true,
        });

        onClose();

        if (onDeleteSuccess) {
          onDeleteSuccess(courseId);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Error deleting course:", error);
        enqueueSnackbar(
          error.response?.data?.message || "Failed to delete course",
          {
            variant: "error",
            autoHideDuration: 3000,
            persist: true,
          }
        );
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full border border-blue-500">
        <h2 className="text-white text-lg font-bold mb-4">
          Delete Confirmation
        </h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the course &quot;{courseName}&quot;?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors`}
            onClick={() => {
              deleteCourse(courseId);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
