/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useSnackbar } from "notistack";

export default function DeleteLessonModal({
  onClose,
  courseId,
  lessonId,
  lessonTitle,
  onDelete,
}) {
  const BASE_URL = "http://localhost:5101";
  const { enqueueSnackbar } = useSnackbar();

  const deleteLesson = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Lesson/${courseId}/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      enqueueSnackbar("Lesson Deleted", { variant: "success" });
      onClose();

      if (onDelete) onDelete();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      enqueueSnackbar("Error Deleting Lesson", { variant: "error" });
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full border border-blue-500">
        <h2 className="text-white text-lg font-bold mb-4">
          Delete Confirmation
        </h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the Lesson &quot;{lessonTitle}&quot;?
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
              deleteLesson();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
