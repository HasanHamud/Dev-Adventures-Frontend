/* eslint-disable react/prop-types */
import { ChevronRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PlanCard({ plan }) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors flex flex-col">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`${
              plan.level === 'Beginner' ? 'bg-blue-900 text-blue-300' :
              plan.level === 'Intermediate' ? 'bg-purple-900 text-purple-300' :
              'bg-red-900 text-red-300'
            } px-2.5 py-0.5 rounded-full text-xs font-medium`}>
              {plan.level}
            </div>
            <div className="text-gray-400 font-medium">
              {plan.duration}
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{plan.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
          <div className="space-y-3">
            {plan.courses.map((course, index) => (
              <div key={index} className="flex items-start text-gray-400 text-sm">
                <CheckCircle className="h-4 w-4 mr-2 mt-1 text-green-500" />
                <span>{course}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-white">${plan.price}</span>
              <span className="text-gray-400 text-sm ml-2">one-time payment</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {plan.totalCourses} courses • {plan.totalHours}+ hours
            </p>
          </div>
        </div>
        <Link
          to="#"
          className="block bg-gray-700 px-5 py-3 text-blue-400 text-sm font-medium hover:bg-gray-600 transition-colors border-t border-gray-700 mt-auto"
        >
          <div className="flex items-center justify-between">
            <span>Get Started</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    )
  }



