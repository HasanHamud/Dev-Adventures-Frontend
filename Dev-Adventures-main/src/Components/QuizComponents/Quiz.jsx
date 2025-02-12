import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = ({ lessonId }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:5101/api/quiz/lesson/${lessonId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setQuiz(response.data);
      } catch (error) {
        setError("Failed to load quiz");
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        'http://localhost:5101/api/quiz/submit',
        {
          quizId: quiz.id,
          answers: answers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setScore(response.data);
    } catch (error) {
      setError("Failed to submit quiz");
      console.error("Error submitting quiz:", error);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!quiz) return null;
  if (score !== null) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 w-full">
        <h2 className="text-2xl text-white font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl text-white">Your score: {score}%</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full">
      <h2 className="text-2xl text-white font-bold mb-4">{quiz.title}</h2>
      <div className="mb-6">
        <p className="text-lg text-white mb-4">{question.text}</p>
        <div className="space-y-2">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                answers[question.id] === answer.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              onClick={() => handleAnswer(question.id, answer.id)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        {currentQuestion > 0 && (
          <button 
            onClick={() => setCurrentQuestion(curr => curr - 1)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all"
          >
            Previous
          </button>
        )}
        {currentQuestion < quiz.questions.length - 1 ? (
          <button 
            onClick={() => setCurrentQuestion(curr => curr + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all ml-auto"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all ml-auto"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;