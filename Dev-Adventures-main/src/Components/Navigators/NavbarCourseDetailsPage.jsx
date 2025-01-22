export const NavbarCourseDetailsPage = () => (
  <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
          <div>
            <h1 className="text-white text-xl font-semibold">
              Advanced Web Development
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">★ 4.5</span>
              <span className="text-gray-400">· 156 students</span>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
          Enroll Now
        </button>
      </div>
    </div>
  </div>
);
