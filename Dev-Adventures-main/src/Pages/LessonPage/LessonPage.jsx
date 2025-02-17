/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import {
  Book,
  CheckCircle,
  Clock,
  GraduationCap,
  Timer,
  Trophy,
  Target,
  BrainCircuit,
  Medal,
  BarChart3,
  ChevronDown,
  PlusCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { AddLessonModal } from "../../Modals/LessonModals/AddLessonModal";
import DeleteLessonModal from "../../Modals/LessonModals/DeleteLessonModal";
import EditLessonModal from "../../Modals/LessonModals/EditLessonModal";

// Reusable Button component
const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
}) => {
  const baseStyles =
    "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "bg-transparent border border-gray-700 text-white hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-700",
  };
  const sizeStyles = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm",
    icon: "p-1",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Reusable Progress component
const Progress = ({ value, className = "" }) => {
  return (
    <div
      className={`h-1 w-full bg-gray-700/50 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full transition-all"
        style={{
          width: `${value}%`,
          backgroundColor: value >= 70 ? "#22c55e" : "#ef4444",
        }}
      />
    </div>
  );
};

export default function LessonPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);

  if (!courseId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-800 text-white">
        No course selected. Please select a course first.
      </div>
    );
  }

  const fetchAllLessons = async (courseId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No authentication token found. Please log in");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5101/api/lesson/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons(response.data);
    } catch (error) {
      console.error("Something went wrong:", error);
      setError("Failed to fetch lessons");
    }
  };

  useEffect(() => {
    fetchAllLessons(courseId);
  }, [courseId]);

  // Modal handlers (edit & delete remain available if needed)
  const handleAddLesson = () => {
    setIsAddModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLesson(null);
    fetchAllLessons(courseId);
  };

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  // Compute course statistics (using lesson.status and quiz info)
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  ).length;
  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  // Assuming each lesson has a "duration" property (or default to 20 mins)
  const totalDuration = lessons.reduce(
    (acc, lesson) => acc + (Number(lesson.duration) || 20),
    0
  );
  const completedQuizzes = lessons.filter(
    (lesson) => lesson.quiz && lesson.quiz.completed
  ).length;

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            Course Title
          </h1>
          <p className="text-gray-400">
            Master the fundamentals and advanced concepts of web development
          </p>
          <div className="mt-4">
            <Button
              onClick={handleAddLesson}
              className="inline-flex items-center"
            >
              Add New Lesson <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Course Stats */}
        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/20 p-3">
                <GraduationCap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-xl font-semibold text-white">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-gray-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-3">
                <Timer className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-xl font-semibold text-white">
                  {totalDuration} mins
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-gray-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-500/20 p-3">
                <BrainCircuit className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Quizzes</p>
                <p className="text-xl font-semibold text-white">
                  {completedQuizzes}/{totalLessons}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-gray-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-500/20 p-3">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-semibold text-white">
                  {completedLessons}/{totalLessons}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Timeline / Accordion */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Course Content</h2>
            <div className="text-sm text-gray-400">
              {completedLessons} of {totalLessons} lessons completed
            </div>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`rounded-lg border ${
                  expandedLesson === lesson.id
                    ? "border-blue-500/50 bg-gray-900/80"
                    : "border-gray-700 bg-gray-900/50"
                } transition-all duration-200`}
              >
                {/* Lesson Header */}
                <div
                  className="flex cursor-pointer items-center justify-between p-4"
                  onClick={() =>
                    setExpandedLesson(
                      expandedLesson === lesson.id ? null : lesson.id
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        lesson.status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {lesson.status === "completed" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Book className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          Lesson {index + 1}
                        </h3>
                        {lesson.status === "completed" && (
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{lesson.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.duration || "20 mins"}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedLesson === lesson.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedLesson === lesson.id && (
                  <div className="border-t border-gray-700 p-4">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Lesson Content */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <Target className="h-4 w-4 text-blue-400" />
                            <span>Learning Outcomes</span>
                          </div>
                          <ul className="space-y-2">
                            {lesson.outcomes?.map((outcome, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-gray-400"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500/50" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          className={`w-full ${
                            lesson.status === "completed"
                              ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          onClick={() =>
                            navigate(
                              `/courses/${courseId}/lessons/${lesson.id}`,
                              {
                                state: { lessonData: lesson },
                              }
                            )
                          }
                        >
                          {lesson.status === "completed"
                            ? "Review Lesson"
                            : "Start Lesson"}
                        </Button>
                      </div>

                      {/* Quiz Section */}
                      <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-purple-400" />
                            <h4 className="font-medium text-white">
                              {lesson.quiz?.title || "Quiz Title"}
                            </h4>
                          </div>
                          {lesson.quiz?.completed && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                              Passed
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-md bg-gray-800 p-2">
                            <div className="flex items-center gap-2">
                              <Medal className="h-4 w-4 text-yellow-500" />
                              <span className="text-xs text-gray-400">
                                Required Score
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-medium text-white">
                              {lesson.quiz?.passingScore || 70}%
                            </p>
                          </div>
                          <div className="rounded-md bg-gray-800 p-2">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-400">
                                Attempts Left
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-medium text-white">
                              {lesson.quiz
                                ? lesson.quiz.maxAttempts - lesson.quiz.attempts
                                : 3}
                            </p>
                          </div>
                        </div>

                        {lesson.quiz?.completed ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Your Score</span>
                              <span className="font-medium text-white">
                                {lesson.quiz.score || 0}%
                              </span>
                            </div>
                            <Progress
                              value={lesson.quiz.score || 0}
                              className="h-1.5"
                            />
                            <Button
                              className="mt-2 w-full"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/courses/${courseId}/lessons/${lesson.id}/quiz`,
                                  {
                                    state: { lessonData: lesson },
                                  }
                                )
                              }
                            >
                              Review Quiz
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>
                                Time Limit:{" "}
                                {lesson.quiz?.timeLimit || "15 mins"}
                              </span>
                            </div>
                            <Button
                              className="w-full bg-purple-600 text-white hover:bg-purple-700"
                              disabled={lesson.status !== "completed"}
                              onClick={() =>
                                navigate(
                                  `/courses/${courseId}/lessons/${lesson.id}/quiz`,
                                  {
                                    state: { lessonData: lesson },
                                  }
                                )
                              }
                            >
                              {lesson.status === "completed"
                                ? "Start Quiz"
                                : "Complete Lesson First"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddLessonModal
        courseId={courseId}
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
      />

      {isEditModalOpen && (
        <EditLessonModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          courseId={courseId}
          lessonId={selectedLesson?.id}
          onUpdate={handleCloseModals}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteLessonModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          courseId={courseId}
          lessonId={selectedLesson?.id}
          lessonTitle={selectedLesson?.title}
          onDelete={handleCloseModals}
        />
      )}
    </div>
  );
}
