export const CourseContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-white text-xl font-semibold mb-3">
        About This Course
      </h2>
      <p className="text-gray-400">
        Master modern web development with this comprehensive course covering
        frontend and backend technologies.
      </p>
    </div>

    <div>
      <h2 className="text-white text-xl font-semibold mb-4">
        What You&apos;ll Learn
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex items-start space-x-3">
            <span className="text-blue-500">✓</span>
            <span className="text-gray-400">
              Build professional web applications with modern tools and
              frameworks
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
