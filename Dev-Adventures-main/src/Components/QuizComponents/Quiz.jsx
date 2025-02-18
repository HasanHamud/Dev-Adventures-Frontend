/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Quiz = ({ lessonId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
  }, []);

  const {
    data: quiz,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["quiz", lessonId],
    queryFn: async () => {
      const token = getAuthToken();
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

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
        throw new Error("Please log in again");
      }

      if (!response.ok) throw new Error("Failed to fetch quiz");
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const response = await fetch("http://localhost:5101/api/Quiz/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: answers,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
        throw new Error("Please log in again");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit quiz");
      }

      return response.json();
    },
    onError: (error) => {
      if (error.message.includes("log in")) {
        navigate("/login");
      }
      console.error("Submit error:", error);
    },
  });

  if (isLoading) return <div className="text-white">Loading quiz...</div>;
  if (isError) return <div className="text-red-500">{error.message}</div>;
  if (!quiz)
    return <div className="text-white">No quiz found for this lesson.</div>;

  const question = quiz.questions[currentQuestion];
  const isQuizComplete = Object.keys(answers).length === quiz.questions.length;

  const handleAnswer = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    if (!isQuizComplete) {
      alert("Please answer all questions before submitting.");
      return;
    }
    submitMutation.mutate();
  };

  if (submitMutation.isSuccess) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 w-full">
        <h2 className="text-2xl text-white font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl text-white">Your score: {submitMutation.data}%</p>
        {submitMutation.data >= 70 ? (
          <p className="text-green-500 mt-4">
            Congratulations! You passed the quiz!
          </p>
        ) : (
          <p className="text-yellow-500 mt-4">Keep studying and try again!</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white font-bold">{quiz.title}</h2>
        <span className="text-gray-400">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-lg text-white mb-4">{question.text}</p>
        <div className="space-y-2">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                answers[question.id] === answer.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswer(question.id, answer.id)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentQuestion((curr) => curr - 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 
            transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentQuestion === 0}
        >
          Previous
        </button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion((curr) => curr + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!answers[question.id]}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isQuizComplete || submitMutation.isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isLoading ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                answers[quiz.questions[index].id]
                  ? "bg-blue-500"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
