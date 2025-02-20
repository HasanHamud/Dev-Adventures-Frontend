/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
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
import { jwtDecode } from "jwt-decode";
import { jsPDF } from "jspdf";

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
  const location = useLocation();
  const { title, description } = location.state || {};
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
  });
  const [lessonQuizzes, setLessonQuizzes] = useState({});
  const [lessonProgress, setLessonProgress] = useState({});
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!courseId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-800 text-white">
        No course selected. Please select a course first.
      </div>
    );
  }

  const checkLessonCompletion = async (lessonId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const videosResponse = await axios.get(
        `http://localhost:5101/api/video/lesson/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const completedVideosResponse = await axios.get(
        `http://localhost:5101/api/progress/video/completed/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const allVideos = videosResponse.data;
      const completedVideos = completedVideosResponse.data;

      const isComplete =
        allVideos.length > 0 &&
        allVideos.every((video) =>
          completedVideos.some((completed) => completed.videoId === video.id)
        );

      if (isComplete) {
        await markLessonAsCompleted(lessonId);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking lesson completion:", error);
      return false;
    }
  };
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      return decodedToken.sub;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const checkCourseCompletion = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const completedLessons = lessons.filter(
        (lesson) => lesson.status === "completed"
      );
      const allLessonsCompleted =
        completedLessons.length === lessons.length && lessons.length > 0;

      if (allLessonsCompleted && !courseCompleted) {
        await markCourseAsCompleted();
        setCourseCompleted(true);
        enqueueSnackbar("Course completed successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error checking course completion:", error);
    }
  };

  const markLessonAsCompleted = async (lessonId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5101/api/progress/lesson/${lessonId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, status: "completed" } : lesson
        )
      );

      enqueueSnackbar("Lesson completed successfully!", { variant: "success" });

      await checkCourseCompletion();
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      enqueueSnackbar("Failed to mark lesson as completed", {
        variant: "error",
      });
    }
  };

  const markCourseAsCompleted = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5101/api/progress/course/${courseId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error marking course as completed:", error);
    }
  };

  const fetchAllLessons = async (courseId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in");
      return;
    }
    try {
      const [lessonsResponse, courseProgressResponse] = await Promise.all([
        axios.get(`http://localhost:5101/api/lesson/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        axios.get(
          `http://localhost:5101/api/progress/course/${courseId}/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      setLessons(lessonsResponse.data);
      setCourseCompleted(courseProgressResponse.data.isCompleted);

      for (const lesson of lessonsResponse.data) {
        await checkLessonCompletion(lesson.id);
      }

      await checkCourseCompletion();
    } catch (error) {
      console.error("Something went wrong:", error);
      setError("Failed to fetch lessons");
    }
  };

  const handleVideoCompletion = async (lessonId) => {
    const lessonCompleted = await checkLessonCompletion(lessonId);
    if (lessonCompleted) {
      await checkCourseCompletion();
      fetchAllLessons(courseId);
    }
  };
  const navigateToLesson = (lesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.id}`, {
      state: {
        lessonData: lesson,
        onVideoCompletion: () => handleVideoCompletion(lesson.id),
      },
    });
  };

  const fetchCourseDetails = async (courseId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5101/api/progress/course/${courseId}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCourseCompleted(response.data.isCompleted);
    } catch (error) {
      console.error("Failed to fetch course progress:", error);
      setError("Failed to fetch course progress");
    }
  };

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
            data: response.data,
          };
        } catch (error) {
          console.error(`Error checking quiz for lesson ${lesson.id}:`, error);
          quizStatus[lesson.id] = {
            exists: false,
            data: null,
          };
        }
      }

      setLessonQuizzes(quizStatus);
    };

    if (lessons.length > 0) {
      checkQuizzes();
    }
  }, [lessons]);

  useEffect(() => {
    fetchCourseDetails(courseId);
    fetchAllLessons(courseId);
  }, [courseId]);

  useEffect(() => {
    const checkQuizzes = async () => {
      const token = localStorage.getItem("authToken");

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
          quizStatus[lesson.id] = !!response.data;
        } catch (error) {
          quizStatus[lesson.id] = false;
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

  const handleDownloadCertificate = async () => {
    const token = localStorage.getItem("authToken");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      enqueueSnackbar("User not authenticated. Please log in.", {
        variant: "error",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const profileResponse = await axios.get(
        `http://localhost:5101/api/Profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(profileResponse.data);

      const userProfile = profileResponse.data;
      const userName = userProfile.fullname || "John Doe";
      const courseName = title || "Course Name";

      console.log("User Profile:", userProfile);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      doc.setFontSize(30);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Certificate of Completion", pageWidth / 2, 50, {
        align: "center",
      });

      doc.setFontSize(24);
      doc.setFont("helvetica", "normal");
      doc.text(`This is to certify that`, pageWidth / 2, 80, {
        align: "center",
      });
      doc.text(`${userName}`, pageWidth / 2, 100, { align: "center" });

      doc.text(`has successfully completed the course`, pageWidth / 2, 120, {
        align: "center",
      });
      doc.text(`${courseName}`, pageWidth / 2, 140, { align: "center" });

      doc.setFontSize(16);
      doc.setFont("helvetica", "italic");
      doc.text(
        description || "Course description goes here",
        pageWidth / 2,
        160,
        {
          align: "center",
          maxWidth: pageWidth - 40,
        }
      );

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ", 50, pageHeight - 30);

      doc.setLineWidth(1);
      doc.line(60, pageHeight - 35, 120, pageHeight - 35);

      doc.save(`Certificate-${courseId}.pdf`);

      enqueueSnackbar("Certificate downloaded successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      enqueueSnackbar("Failed to generate certificate", { variant: "error" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenQuiz = (lesson, index) => {
    if (lessonQuizzes[lesson.id]) {
      navigate(`/courses/${courseId}/lessons/${lesson.id}/quiz`, {
        state: {
          lessonId: lesson.id,
          lessonNumber: index + 1,
        },
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
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
            {title || "Loading..."}
          </h1>
          <p className="text-gray-400">
            {description || "Loading course description..."}
          </p>
          ``
          {/* Course Completion Section */}
          {courseCompleted && (
            <div className="mt-4 text-green-500">
              <CheckCircle className="inline h-6 w-6" /> Course Completed
              <button
                onClick={handleDownloadCertificate}
                className="ml-4 inline-flex items-center bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md"
              >
                {isDownloading ? "Downloading..." : "Download Certificate"}
              </button>
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
                  <div className="flex items-center gap-2">
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
                        <LearningOutcomesComponent
                          lessonId={lesson.id}
                          initialOutcomes={lesson.outcomes || []}
                          onUpdate={() => fetchAllLessons(courseId)}
                        />
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
                              Lesson Quiz
                            </h4>
                          </div>
                        </div>

                        {lessonQuizzes[lesson.id] ? (
                          <div className="space-y-3">
                            <Button
                              className="w-full bg-purple-600 text-white hover:bg-purple-700"
                              onClick={() => handleOpenQuiz(lesson, index)}
                            >
                              Start Quiz
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Button
                              className="w-full bg-purple-600 text-white hover:bg-purple-700"
                              onClick={() => handleOpenQuiz(lesson, index)}
                            >
                              Create Quiz
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
    </div>
  );
}
