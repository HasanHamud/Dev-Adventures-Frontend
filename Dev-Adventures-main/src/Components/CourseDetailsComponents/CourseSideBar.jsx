export const CourseSidebar = () => (
  <div className="fixed top-24 right-6 w-[calc(100%/3-32px)] max-w-md">
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">Course Details</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Level</span>
          <span className="text-white">Intermediate</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Created</span>
          <span className="text-white">1/1/2024</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last Updated</span>
          <span className="text-white">1/15/2024</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Students</span>
          <span className="text-white">156 enrolled</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Requirements</h3>
        <ul className="space-y-2">
          {[1, 2, 3].map((item) => (
            <li key={item} className="text-gray-400 flex items-start space-x-2">
              <span className="text-blue-500">›</span>
              <span>Basic understanding of web development concepts</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg">
        Enroll Now for $99.99
      </button>
    </div>
  </div>
);
