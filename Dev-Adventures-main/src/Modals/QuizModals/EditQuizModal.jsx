/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-base font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

export const EditQuizModal = ({ lessonId, quizId, isOpen, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    title: "",
    questions: [
      {
        text: "",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5101";

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!isOpen || !lessonId) return;

      const token = localStorage.getItem("authToken");
      if (!token) {
        enqueueSnackbar("You are not logged in!", { variant: "error" });
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/quiz/lesson/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Transform the received data to match our form structure
        setFormData({
          title: response.data.title,
          questions: response.data.questions.map((q) => ({
            text: q.text,
            answers: q.answers.map((a) => ({
              text: a.text,
              isCorrect: a.isCorrect || false,
            })),
          })),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        enqueueSnackbar("Error loading quiz data", { variant: "error" });
        onClose();
      }
    };

    fetchQuizData();
  }, [lessonId, isOpen]);

  const handleTitleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleQuestionChange = (questionIndex, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].text = e.target.value;
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers[answerIndex].text = e.target.value;
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const handleCorrectAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers = newQuestions[
      questionIndex
    ].answers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === answerIndex,
    }));
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== questionIndex),
      }));
    } else {
      enqueueSnackbar("Quiz must have at least one question", {
        variant: "warning",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      enqueueSnackbar("You are not logged in!", { variant: "error" });
      return;
    }

    const transformedData = {
      id: quizId,
      title: formData.title,
      lessonId: Number(lessonId),
      questions: formData.questions.map((question) => ({
        text: question.text,
        answers: question.answers.map((answer) => ({
          text: answer.text,
          isCorrect: answer.isCorrect,
        })),
      })),
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/api/quiz/${quizId}`,
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onClose();
      enqueueSnackbar("Quiz updated successfully", { variant: "success" });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        const errorMessage =
          error.response.data.title || "Failed to update quiz";
        enqueueSnackbar(`Error: ${errorMessage}`, { variant: "error" });
      } else {
        console.error("Error:", error);
        enqueueSnackbar("Error updating quiz", { variant: "error" });
      }
    }
  };

  if (!isOpen) return null;
  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-white">Loading quiz data...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Edit Quiz</h2>
        <form onSubmit={handleSubmit}>
          <FormField label="Quiz Title">
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Enter quiz title"
            />
          </FormField>

          {formData.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="border border-gray-600 rounded p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">
                  Question {questionIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <FormField label="Question Text">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(questionIndex, e)}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter question"
                />
              </FormField>

              {question.answers.map((answer, answerIndex) => (
                <div
                  key={answerIndex}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(questionIndex, answerIndex, e)
                    }
                    className="flex-1 p-2 bg-gray-700 text-white rounded"
                    placeholder={`Answer ${answerIndex + 1}`}
                  />
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="radio"
                      name={`correct-answer-${questionIndex}`}
                      checked={answer.isCorrect}
                      onChange={() =>
                        handleCorrectAnswer(questionIndex, answerIndex)
                      }
                      className="form-radio"
                    />
                    <span>Correct</span>
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Question
          </button>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
