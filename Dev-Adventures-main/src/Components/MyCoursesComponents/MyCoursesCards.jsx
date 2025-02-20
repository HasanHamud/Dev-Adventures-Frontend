/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "lucide-react";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = () => {
    setIsLoading(true); // Show the spinner
    navigate(`/courses/${course.courseId}/lessons`, {
      state: {
        courseData: {
          ...course,
          id: course.courseId,
        },
        lessons: course.lessons || [],
      },
    });
    // No need for setIsLoading(false) here because the component will unmount after navigation
  };

  return (
    <div className="relative">
      <div
        onClick={handleCardClick}
        className="cursor-pointer group block overflow-hidden border border-gray-700 bg-gray-900 rounded-xl transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
      >
        <div className="relative h-48 w-full">
          {course.imgURL || course.ImgURL ? (
            <img
              src={`http://localhost:5101${course.imgURL || course.ImgURL}`}
              alt={course.title || course.Title || "Course Image"}
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

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-500">
            {course.title || course.Title}
          </h3>
          <p className="mt-2 text-sm text-gray-400 line-clamp-2">
            {course.description || course.Description}
          </p>
          <div className="mt-3 flex justify-between text-gray-400 text-sm">
            <span>⭐ {course.rating || course.Rating}</span>
            <span>${course.price || course.Price}</span>
          </div>
          <div className="mt-3 flex justify-between text-gray-400 text-xs">
            <span>
              📅{" "}
              {new Date(
                course.enrollmentDate || course.EnrollmentDate || Date.now()
              ).toLocaleDateString()}
            </span>
            <span>🕒 {course.duration || course.Duration} hours</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}