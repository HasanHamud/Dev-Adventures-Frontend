import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { CourseCard } from "../../Components/CoursesComponents/CoursesCard";
import { CoursesHeader } from "../../Components/CoursesComponents/CoursesHeader";
import Navbar from "../../Components/Navigators/Navbar";
import AddCourseModal from "../../Modals/CoursesModals/AddCourseModal";
import UpdateCourseModal from "../../Modals/CoursesModals/EditCourseModal";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CoursesPage() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  const {
    data: courses,
    error,
    isLoading,
    mutate,
  } = useSWR("http://localhost:5101/api/Courses", fetcher);

  const handleEditClick = async (courseId) => {
    const response = await axios.get(
      `http://localhost:5101/api/Courses/${courseId}`
    );
    setSelectedCourse(response.data);
    setUpdateModalOpen(true);
  };

  const handleCourseAdded = async () => {
    setIsAddingCourse(true);
    try {
      await mutate();
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding course:", error);
    } finally {
      setIsAddingCourse(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-red-900 text-red-300 p-4 rounded-lg text-center">
        Error: {error.message}
      </div>
    </div>
  );

  if (isLoading || isAddingCourse) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <Navbar />
      <CoursesHeader
        onAddClick={() => setAddModalOpen(true)}
        onEditClick={() => handleEditClick(courses[0].id)}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => handleEditClick(course.id)}
            />
          ))}
        </div>
      </div>
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCourseAdded={handleCourseAdded}
      />
      <UpdateCourseModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        course={selectedCourse}
        onCourseUpdated={() => mutate()}
      />
    </div>
  );
}
