import React, { useState } from 'react';
import Lesson from "../../Components/LessonComponents/Lesson"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function LessonPage() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      <h1 className="text-4xl text-white text-center font-bold pt-4">Course Title</h1>
      <div className="grid grid-cols-5 gap-4 px-4 py-8 place-items-center">
        {numbers.map((number, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center relative top-0 bottom-0 "
          >
            <Lesson number={number} />
            
            {/* {index < numbers.length - 1 && (index + 1) % 5 !== 0 && (
              <div className="text-blue-500 mx-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}