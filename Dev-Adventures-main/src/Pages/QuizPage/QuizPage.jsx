import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Quiz from "../../Components/QuizComponents/Quiz";
import { EditQuizModal } from "../../Modals/QuizModals/EditQuizModal";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonId, lessonNumber } = location.state || {};
  const [quiz, setQuiz] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      navigate(-1);
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5101/api/Quiz/lesson/${lessonId}`
        );
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [lessonId, navigate]);

  if (!lessonId) {
    navigate(-1);
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-all"
        >
          ← Back
        </button>
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-2xl text-white font-bold mb-6">
            Lesson {lessonNumber} Quiz
          </h1>
          {quiz ? (
            <>
              <Quiz lessonId={lessonId} />
              <button
                onClick={toggleModal}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Quiz
              </button>
            </>
          ) : (
            <p className="text-white">No quiz available for this lesson.</p>
          )}
        </div>
      </div>

      {/* Modal Component */}
      <EditQuizModal
        lessonId={lessonId}
        quizId={quiz?.id}
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
    </div>
  );
}
