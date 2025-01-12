/* eslint-disable react/prop-types */
import { Book, ChevronRight, Clock, Code, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function CourseCard({ course }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors flex flex-col h-full">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-blue-900 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {course.level}
          </div>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-gray-300 text-sm">{course.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{course.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-blue-500 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center text-purple-500 text-sm">
            <Book className="h-4 w-4 mr-2" />
            <span>
              {" "}
              <span className=" text-lg"> {course.lessons}</span> lessons
            </span>
          </div>
          <div className="flex items-center font-bold text-yellow-400 text-sm">
            <Code className="h-4 w-4 mr-2" />
            <span>{course.language}</span>
          </div>
        </div>
        {/* Price Section */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <span className="text-white font-semibold text-xl">
            ${course.price}
          </span>
          <span className="text-gray-400 text-sm ml-2">one-time payment</span>
        </div>
      </div>
      <Link
        to="#"
        className="block bg-gray-700 px-5 py-2.5 text-blue-400 text-sm font-medium hover:bg-gray-600 transition-colors border-t border-gray-700"
      >
        <div className="flex items-center justify-between">
          <span>Start Learning</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </Link>
    </div>
  );
}
