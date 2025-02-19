import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CourseContent } from "../../../Components/CourseDetailsComponents/CourseContent";
import { CourseSidebar } from "../../../Components/CourseDetailsComponents/CourseSideBar";
import { CourseStats } from "../../../Components/CourseDetailsComponents/CourseStats";
import { PreviewSection } from "../../../Components/CourseDetailsComponents/PreviewComponent";
import Navbar from "../../../Components/Navigators/Navbar";

const CourseDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Get course data from navigation state
    if (location.state?.courseData) {
      setCourse(location.state.courseData);
    } else {
      // If no course data in state, redirect to courses page
      navigate("/courses");
    }
  }, [location.state, navigate]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="h-20" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="md:col-span-2 space-y-6 pb-6">
            <PreviewSection youtubeUrl={course.previewURL || "https://youtu.be/VSYpWoCTUNg"} />
            <CourseStats course={course} />
            <CourseContent courseId={course.id} lessons={course.lessons} />
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-20 pt-4">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;