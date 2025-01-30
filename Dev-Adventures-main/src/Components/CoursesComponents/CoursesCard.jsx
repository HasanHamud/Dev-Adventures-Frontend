/* eslint-disable react/prop-types */
import {
  Book,
  ChevronRight,
  Clock,
  Code,
  Star,
  Trash2,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteCourseModal } from "../../Modals/CoursesModals/DeleteCourseModal";

export function CourseCard({ course, onEdit }) {
  const [isLoading, setIsLoading] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartLearningClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/courses/details", { state: { courseData: course } });
    }, 1000);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors flex flex-col h-full">
      <div className="relative h-48 w-full">
        {course.imgURL ? (
          <img
            src={`http://localhost:5101${course.imgURL}`}
            alt={course.title || "Course Image"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
            <ImageIcon className="text-gray-500 h-16 w-16" strokeWidth={1} />
            <span className="absolute bottom-2 left-2 text-gray-400 text-xs">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex bg-blue-900 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
              Inprogress
            </div>
            <div className="flex bg-blue-900 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
              {course.level}
            </div>
          </div>
          <div className="flex-grow" />
          <div className="flex items-center text-yellow-400 gap-2">
            <span className="flex text-gray-300 text-m">{course.rating}</span>
            <Star className="h-4 w-4 fill-current" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(course.id)}>
              <Pencil className="h-4 w-4 text-blue-500 hover:text-blue-400" />
            </button>
            <button onClick={() => setDeleteModalOpen(true)}>
              <Trash2 color="red" />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{course.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-blue-500 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{course.duration} weeks</span>
          </div>
          <div className="flex items-center text-purple-500 text-sm">
            <Book className="h-4 w-4 mr-2" />
            <span>
              {" "}
              <span className="text-lg">12 {course.lessons}</span> lessons{" "}
            </span>
          </div>
          <div className="flex items-center font-bold text-yellow-400 text-sm">
            <Code className="h-4 w-4 mr-2" />
            <span>{course.language}</span>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <span className="text-white font-semibold text-xl">
            ${course.price}
          </span>{" "}
          <span className="text-gray-400 text-sm ml-2">one-time payment</span>
        </div>
      </div>
      <button
        onClick={handleStartLearningClick}
        className="block bg-gray-700 px-5 py-2.5 text-blue-400 text-sm font-medium hover:bg-gray-600 transition-colors border-t border-gray-700"
      >
        <div className="flex items-center justify-between">
          <span>Start Learning</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </button>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        courseName={course?.title || ""}
        courseId={course?.id}
      />
    </div>
  );
}
