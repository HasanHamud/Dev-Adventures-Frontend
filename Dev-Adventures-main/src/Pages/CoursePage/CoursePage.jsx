import axios from "axios";
import { useEffect, useState } from "react";
import { CourseCard } from "../../Components/CoursesComponents/CoursesCard";
import { CoursesHeader } from "../../Components/CoursesComponents/CoursesHeader";
import NavbarCoursePage from "../../Components/Navigators/NavbarCoursePage";
import AddCourseModal from "../../Modals/CoursesModals/AddCourseModal";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5101/api/Courses");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-900">
      <NavbarCoursePage />
      <CoursesHeader onAddClick={() => setModalOpen(true)} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gray-900">
      <NavbarCoursePage />
      <CoursesHeader onAddClick={() => setModalOpen(true)} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 text-red-300 p-4 rounded-lg text-center">
          Error: {error}
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;

  return (
    <div className="min-h-screen bg-gray-900">
      <NavbarCoursePage />
      <CoursesHeader onAddClick={() => setModalOpen(true)} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative"
              onTouchEnd={(e) => clearTimeout(e.currentTarget.pressTimer)}
              onMouseUp={(e) => clearTimeout(e.currentTarget.pressTimer)}
              onMouseLeave={(e) => clearTimeout(e.currentTarget.pressTimer)}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCourseAdded={fetchCourses}
      />
    </div>
  );
}
