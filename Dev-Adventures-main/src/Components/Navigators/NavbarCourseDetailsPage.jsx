import { useLocation } from "react-router";

export const NavbarCourseDetailsPage = () => {
  const { state } = useLocation();
  const courseData = state?.courseData;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black py-3 px-4 shadow-md backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* Course Image and Title Section */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg border border-gray-700 mr-4"></div>
              <div>
                <h1 className="text-white font-bold text-xl">
                  {courseData?.title || "Java"}
                </h1>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-blue-500">
                    ★ {courseData?.rating || "0.0"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">156 students</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enroll Button */}
          <button className="px-6 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarCourseDetailsPage;
