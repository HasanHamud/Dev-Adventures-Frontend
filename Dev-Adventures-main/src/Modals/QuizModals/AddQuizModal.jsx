import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-base font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

export const AddQuizModal = ({ lessonId, isOpen, onClose }) => {
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
          { text: "", isCorrect: false }
        ]
      }
    ]
  });

  const BASE_URL = "http://localhost:5101";

  const handleTitleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleQuestionChange = (questionIndex, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].text = e.target.value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers[answerIndex].text = e.target.value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleCorrectAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.map(
      (answer, idx) => ({ ...answer, isCorrect: idx === answerIndex })
    );
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
          ]
        }
      ]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      enqueueSnackbar("You are not logged in!", { variant: "error" });
      return;
    }

    // Transform the data to match the QuizDTO structure
    const transformedData = {
      title: formData.title,
      lessonId: Number(lessonId),
      questions: formData.questions.map(question => ({
        text: question.text,
        answers: question.answers.map(answer => ({
          text: answer.text,
          isCorrect: answer.isCorrect
        }))
      }))
    };

    console.log("Submitting transformed quiz data:", transformedData);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/quiz`,
        transformedData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      onClose();
      enqueueSnackbar("Quiz created successfully", { variant: "success" });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        const errorMessage = error.response.data.title || 'Failed to create quiz';
        enqueueSnackbar(`Error: ${errorMessage}`, { variant: "error" });
      } else {
        console.error("Error:", error);
        enqueueSnackbar("Error creating quiz", { variant: "error" });
      }
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Add Quiz</h2>
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
            <div key={questionIndex} className="border border-gray-600 rounded p-4 mb-4">
              <FormField label={`Question ${questionIndex + 1}`}>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(questionIndex, e)}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter question"
                />
              </FormField>

              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e)}
                    className="flex-1 p-2 bg-gray-700 text-white rounded"
                    placeholder={`Answer ${answerIndex + 1}`}
                  />
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="radio"
                      name={`correct-answer-${questionIndex}`}
                      checked={answer.isCorrect}
                      onChange={() => handleCorrectAnswer(questionIndex, answerIndex)}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};