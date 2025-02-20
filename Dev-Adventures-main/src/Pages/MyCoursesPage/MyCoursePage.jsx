/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import axios from "axios";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../Components/MyCoursesComponents/MyCoursesCards";
import Navbar from "../../Components/Navigators/Navbar";

function MyCoursePage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          "http://localhost:5101/api/UserCourses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Fetched courses:", response.data);

        // Updated to use courseId instead of id
        const validCourses = response.data.filter((course) => {
          if (!course.courseId) {
            console.error("Course missing ID:", course);
            return false;
          }
          return true;
        });

        setCourses(validCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (course) => {
    if (!course || !course.courseId) {
      console.error("Invalid course data:", course);
      return;
    }

    navigate(`/courses/${course.courseId}/lessons`, {
      state: {
        courseData: {
          ...course,
          id: course.courseId,
        },
        lessons: course.lessons || [],
        title: course.title,
        description: course.description,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 my-10">
      <Navbar />
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-8 rounded-2xl bg-gray-900 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
                  <GraduationCap className="h-8 w-8 text-blue-500" />
                  My Learning Path
                </h1>
                <p className="text-gray-400">
                  Continue your journey to mastery
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.courseId}
                  onClick={() => handleCourseClick(course)}
                  className="cursor-pointer"
                >
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No courses found. Start by enrolling in a course!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCoursePage;
