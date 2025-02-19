import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Quiz from "../../Components/QuizComponents/Quiz";
import { EditQuizModal } from "../../Modals/QuizModals/EditQuizModal";
import Navbar from "../../Components/Navigators/Navbar";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonId, lessonNumber } = location.state || {};
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    data: quiz,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["quiz", lessonId],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(
        `http://localhost:5101/api/Quiz/lesson/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
          throw new Error("Please log in again");
        }
        throw new Error("Failed to fetch quiz");
      }

      return response.json();
    },
    enabled: !!lessonId,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  if (!lessonId) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white text-lg">No lesson selected</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Return to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 ">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Lesson
            </button>
            {quiz && !isLoading && !isError && (
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Edit Quiz
              </button>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-8">
            <h1 className="text-2xl text-white font-bold mb-6">
              Lesson {lessonNumber} Quiz
            </h1>

            {isError ? (
              <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">
                {error.message}
              </div>
            ) : (
              <Quiz lessonId={lessonId} />
            )}
          </div>
        </div>
      </div>

      {quiz && (
        <EditQuizModal
          lessonId={lessonId}
          quizId={quiz.id}
          isOpen={isModalOpen}
          onClose={toggleModal}
        />
      )}
    </div>
  );
}