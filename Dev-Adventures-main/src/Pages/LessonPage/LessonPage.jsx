import React, { useEffect, useState } from 'react';
import Lesson from "../../Components/LessonComponents/Lesson";
import { TrophyIcon, PlusCircle, Trash2, PenIcon } from 'lucide-react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { AddLessonModal } from '../../Modals/LessonModals/AddLessonModal';
import EditLessonModal from "../../Modals/LessonModals/EditLessonModal";
import DeleteLessonModal from "../../Modals/LessonModals/DeleteLessonModal";
import { AddQuizModal } from '../../Modals/QuizModals/AddQuizModal';

export default function LessonPage() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

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

  const handleAddLesson = () => {
    setIsAddModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const handleAddQuiz = (lesson) => {
    setSelectedLesson(lesson);
    setIsAddQuizModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsAddQuizModalOpen(false);
    setSelectedLesson(null);
    fetchAllLessons();
  };

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      <div className='flex flex-row justify-between items-center px-2'>
        <h1 className="text-2xl text-white text-center font-bold pt-4">Progress: 0/10</h1>
        <h1 className="text-4xl text-white text-center font-bold pt-4">Course Title</h1>
        <div className='flex flex-row'>
          <button onClick={handleAddLesson}>
            <p className='text-white hover:text-blue-500 transition-all px-2'><PlusCircle /></p>
          </button>
          <button className='w-56 flex text-white'>
            <p className='text-yellow-500 px-2'><TrophyIcon /></p>
            <p className="text-lg text-white text-center"> Achievements 3/33 </p>
          </button>
        </div>
      </div>
     
      <div className="grid grid-cols-6 gap-4 px-4 py-8 place-items-center mt-5">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center relative w-full"
          >
            <div className='flex flex-row justify-end w-full space-x-2 mb-2'>
              <button 
                onClick={() => handleAddQuiz(lesson)}
                className='p-2 text-purple-500 hover:text-purple-600 hover:bg-gray-800 rounded-full transition-all'
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEditLesson(lesson)}
                className='p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-800 rounded-full transition-all'
              >
                <PenIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteLesson(lesson)}
                className='p-2 text-red-500 hover:text-red-600 hover:bg-gray-800 rounded-full transition-all'
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Lesson number={index + 1} status='completed' lesson={lesson}/>
          </div>
        ))}
      </div>

      <AddLessonModal
        courseId={1}
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
      />

      {isEditModalOpen && (
        <EditLessonModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          courseId={1}
          lessonId={selectedLesson?.id}
          onUpdate={handleCloseModals}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteLessonModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          courseId={1}
          lessonId={selectedLesson?.id}
          lessonTitle={selectedLesson?.title}
          onDelete={handleCloseModals}
        />
      )}

      {isAddQuizModalOpen && (
        <AddQuizModal
          lessonId={selectedLesson?.id}
          isOpen={isAddQuizModalOpen}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
}