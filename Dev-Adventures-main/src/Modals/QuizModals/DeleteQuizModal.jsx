import axios from "axios";
import { useSnackbar } from "notistack";

export const DeleteQuizModal = ({ quizId, lessonId, quizTitle, isOpen, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const BASE_URL = "http://localhost:5101";

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      enqueueSnackbar("You are not logged in!", { variant: "error" });
      return;
    }

    try {
      await axios.delete(
        `${BASE_URL}/api/quiz/${quizId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      onClose();
      enqueueSnackbar("Quiz deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      const errorMessage = error.response?.data?.title || 'Failed to delete quiz';
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4">Delete Quiz</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this quiz{quizTitle ? `: "${quizTitle}"` : ""}? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};