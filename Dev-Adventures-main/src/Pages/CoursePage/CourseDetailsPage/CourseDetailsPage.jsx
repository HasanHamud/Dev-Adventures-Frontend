import { CourseContent } from "../../../Components/CourseDetailsComponents/CourseContent";
import { CourseSidebar } from "../../../Components/CourseDetailsComponents/CourseSideBar";
import { CourseStats } from "../../../Components/CourseDetailsComponents/CourseStats";
import { PreviewSection } from "../../../Components/CourseDetailsComponents/PreviewComponent";
import Navbar from "../../../Components/Navigators/Navbar";

const CourseDetailsPage = () => {
  const youtubeUrl = "https://youtu.be/VSYpWoCTUNg";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="h-20" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 relative">
          <div className="col-span-2 space-y-6 pb-6">
            <PreviewSection youtubeUrl={youtubeUrl} />
            <CourseStats />
            <CourseContent />
          </div>
          <div className="col-span-1">
            <div className="sticky top-20 pt-4">
              <CourseSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
