import React, { useEffect, useState } from 'react';
import Lesson from "../../Components/LessonComponents/Lesson"
import { Trophy, TrophyIcon, PlusCircle, PenIcon} from 'lucide-react';
import { FaAward } from 'react-icons/fa';
import axios from 'axios';

export default function LessonPage() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);

  const fetchAllLessons = async () => {
    const token = localStorage.getItem("authToken");
   
    if (!token) {
      setError("No authentication token found. Please log in");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5101/api/lesson/Courses/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });  
      setLessons(response.data);
    } catch (error) {
      console.error('something went wrong:', error);
      setError("Failed to fetch lessons");
    }
  };

  useEffect(() => {
    fetchAllLessons();
  }, []);

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      <div className='flex flex-row justify-between items-center px-2'>
        <h1 className="text-2xl text-white text-center font-bold pt-4">Progress: 0/10</h1>
        <h1 className="text-4xl text-white text-center font-bold pt-4">Course Title</h1>
        <div className='flex flex-row justify-center items-center'>
          <button>
            <p className='text-white hover:text-blue-500 transition-all px-2'> <PlusCircle/> </p>
          </button>
          <button className='w-56 flex text-white'>
            <p className='text-yellow-500 px-2'><TrophyIcon/></p>
            <p className="text-lg text-white text-center"> Achievments 3/33  </p>
          </button>
        </div>
      </div>
     
      <div className="flex flex-wrap px-4 py-8 justify-start gap-8 ">
        {lessons.map((number, index) => (
          <div
            key={index}
            className="w-40 h-40 flex items-center justify-center "
          >
            <Lesson number={index+1} status='completed' />
          </div>
        ))}
      </div>
    </div>
  );
}