import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { Button } from "../../Components/LessonDetailsComponents/Button";
import Navbar from "../../Components/Navigators/Navbar";
import LearningOutcomesComponent from "../../Components/LessonDetails/LearningOutcomesComponent";

import AddLessonModal from "../../Modals/LessonModals/AddLessonModal";
import EditLessonModal from "../../Modals/LessonModals/EditLessonModal";
import DeleteLessonModal from "../../Modals/LessonModals/DeleteLessonModal";
import { AddQuizModal } from "../../Modals/QuizModals/AddQuizModal";

import {
  Book,
  CheckCircle,
  Clock,
  GraduationCap,
  Timer,
  BrainCircuit,
  ChevronDown,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";

export default function LessonPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
  });
  const [lessonQuizzes, setLessonQuizzes] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  if (!courseId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-800 text-white">
        No course selected. Please select a course first.
      </div>
    );
  }

  // Check if user is admin
  const checkIfAdmin = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const userIsAdmin = Array.isArray(roles)
          ? roles.includes("Admin")
          : roles === "Admin";
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

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

  const fetchCourseDetails = async (courseId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5101/api/coursedetails/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCourseDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      setError("Failed to fetch course details");
    }
  };

  useEffect(() => {
    checkIfAdmin();
    fetchCourseDetails(courseId);
    fetchAllLessons(courseId);
  }, [courseId]);

  useEffect(() => {
    const checkQuizzes = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const quizStatus = {};
      
      for (const lesson of lessons) {
        try {
          const response = await axios.get(
            `http://localhost:5101/api/quiz/lesson/${lesson.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          quizStatus[lesson.id] = {
            exists: !!response.data,
            data: response.data
          };
        } catch (error) {
          console.error(`Error checking quiz for lesson ${lesson.id}:`, error);
          quizStatus[lesson.id] = {
            exists: false,
            data: null
          };
        }
      }
      
      setLessonQuizzes(quizStatus);
    };
  
    if (lessons.length > 0) {
      checkQuizzes();
    }
  }, [lessons]);

  const handleAddLesson = () => setIsAddModalOpen(true);
  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };
  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const handleOpenQuiz = (lesson, index) => {
    if (lessonQuizzes[lesson.id]) {
      navigate(`/courses/${courseId}/lessons/${lesson.id}/quiz`, {
        state: {
          lessonId: lesson.id,
          lessonNumber: index + 1
        }
      });
    } else {
      setSelectedLesson({ ...lesson, quizMode: "create" });
      setIsQuizModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsQuizModalOpen(false);
    setSelectedLesson(null);
    fetchAllLessons(courseId);
  };

  if (error) return <div className="text-white">{error}</div>;

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  ).length;
  const progress = (completedLessons / totalLessons) * 100;
  const totalDuration = lessons.reduce(
    (acc, lesson) => acc + (Number(lesson.duration) || 20),
    0
  );
  const completedQuizzes = lessons.filter(
    (lesson) => lesson.quiz && lesson.quiz.completed
  ).length;

  return (
    <div className="min-h-screen bg-gray-800 py-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            {courseDetails.title || "Loading..."}
          </h1>
          <p className="text-gray-400">
            {courseDetails.description || "Loading course description..."}
          </p>
          {isAdmin && (
            <div className="mt-4">
              <Button onClick={handleAddLesson} className="inline-flex items-center">
                Add New Lesson <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
  
        {/* Course Stats */}
        <div className="mx-auto mb-10 flex justify-center gap-4">
          <div className="rounded-lg bg-gray-900/50 p-4">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
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
        </div>
  
        {/* Lessons Accordion */}
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
                    setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)
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
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLesson(lesson);
                          }}
                          className="rounded-full p-1 text-gray-400 hover:text-white"
                        >
                          <Pencil className="h-4 w-4 text-blue-500 hover:text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(lesson);
                          }}
                          className="rounded-full p-1 text-gray-400 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </button>
                      </>
                    )}
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
  
                {/* Expanded Lesson Details */}
                {expandedLesson === lesson.id && (
                  <div className="border-t border-gray-700 p-4">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Lesson Content */}
                      <div className="space-y-4">
                        {isAdmin && (
                          <LearningOutcomesComponent
                            lessonId={lesson.id}
                            initialOutcomes={lesson.outcomes || []}
                            onUpdate={() => fetchAllLessons(courseId)}
                          />
                        )}
                        <Button
                          className={`w-full ${
                            lesson.status === "completed"
                              ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          onClick={() =>
                            navigate(`/courses/${courseId}/lessons/${lesson.id}`, {
                              state: { lessonData: lesson },
                            })
                          }
                        >
                          {lesson.status === "completed"
                            ? "Review Lesson"
                            : "Start Lesson"}
                        </Button>
                      </div>
  
                      {/* Quiz Section */}
                     {/* Quiz Section */}
<div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <BrainCircuit className="h-5 w-5 text-purple-400" />
      <h4 className="font-medium text-white">Lesson Quiz</h4>
    </div>
  </div>
  
  {lessonQuizzes[lesson.id]?.exists ? (
    <div className="space-y-3">
      <Button
        className="w-full bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => handleOpenQuiz(lesson, index)}
      >
        Start Quiz
      </Button>
    </div>
  ) : isAdmin ? (
    <div className="space-y-3">
      <Button
        className="w-full bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => handleOpenQuiz(lesson, index)}
      >
        Create Quiz
      </Button>
    </div>
  ) : (
    <div className="text-gray-400 text-center py-2">
      No quiz available
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
      {isAdmin && (
        <>
          <AddLessonModal
            courseId={courseId}
            isOpen={isAddModalOpen}
            onClose={handleCloseModals}
          />
          {isEditModalOpen && selectedLesson && (
            <EditLessonModal
              isOpen={isEditModalOpen}
              onClose={handleCloseModals}
              courseId={courseId}
              lessonId={selectedLesson.id}
              onUpdate={handleCloseModals}
            />
          )}
          {isDeleteModalOpen && selectedLesson && (
            <DeleteLessonModal
              isOpen={isDeleteModalOpen}
              onClose={handleCloseModals}
              courseId={courseId}
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
              onDelete={handleCloseModals}
            />
          )}
          {isQuizModalOpen && selectedLesson && (
            <AddQuizModal
              lessonId={selectedLesson.id}
              isOpen={isQuizModalOpen}
              onClose={handleCloseModals}
              mode={selectedLesson.quizMode}
            />
          )}
        </>
      )}
    </div>
  );
}