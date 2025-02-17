import Quiz from "../../Components/QuizComponents/Quiz";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonId, lessonNumber } = location.state || {};

  // If no lesson data was passed, redirect back
  if (!lessonId) {
    navigate(-1);
    return null;
  }

  const handleBack = () => {
    navigate(-1);
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
          <Quiz lessonId={lessonId} />
        </div>
      </div>
    </div>
  );
}