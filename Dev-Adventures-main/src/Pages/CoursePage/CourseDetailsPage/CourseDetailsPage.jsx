import { NavbarCourseDetailsPage } from "../../../Components/Navigators/NavbarCourseDetailsPage";
import { PreviewSection } from "../../../Components/CourseDetailsComponents/PreviewComponent";
import { CourseStats } from "../../../Components/CourseDetailsComponents/CourseStats";
import { CourseContent } from "../../../Components/CourseDetailsComponents/CourseContent";
import { CourseSidebar } from "../../../Components/CourseDetailsComponents/CourseSideBar";

const CourseDetailsPage = () => {
  const youtubeUrl = "https://youtu.be/VSYpWoCTUNg";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavbarCourseDetailsPage />
      <div className="max-w-7xl mx-auto p-6 pt-24">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <PreviewSection youtubeUrl={youtubeUrl} />
            <CourseStats />
            <CourseContent />
          </div>
          <div className="col-span-1">
            <CourseSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
