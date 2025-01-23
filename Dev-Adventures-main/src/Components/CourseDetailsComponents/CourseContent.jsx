import { useLocation } from "react-router";

export const CourseContent = () => {
  const { state } = useLocation();
  const courseData = state?.courseData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold mb-3">
          About This Course
        </h2>
        <p className="text-gray-400">
          {courseData?.description || "Course description not available"}
        </p>
      </div>

      <div>
        <h2 className="text-white text-xl font-semibold mb-4">
          What You&apos;ll Learn
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {courseData?.learningObjectives?.map((objective, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-blue-500">✓</span>
              <span className="text-gray-400">{objective}</span>
            </div>
          )) || (
            <span className="text-gray-400">
              No learning objectives available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
