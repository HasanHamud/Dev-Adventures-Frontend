/* eslint-disable react/prop-types */
import { PlayCircle, PlusCircle, PencilIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import AddVideoModal from "../../Modals/LessonDetailsModals/AddVideoModal";
import EditVideoModal from "../../Modals/LessonDetailsModals/EditVideoModal";
import DeleteVideoModal from "../../Modals/LessonDetailsModals/DeleteVideoModal";

export default function VideoSideBar({
  videos = [],
  lessonID,
  courseID,
  onVideoSelect,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const numericLessonID = Number(lessonID);
  const numericCourseID = Number(courseID);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (video, e) => {
    e.stopPropagation();
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedVideo(null);
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (video, e) => {
    e.stopPropagation();
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedVideo(null);
    setIsDeleteModalOpen(false);
  };

  const handleVideoUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="w-64 bg-gray-900 flex flex-col text-white overflow-hidden mb-10">
      <div className="bg-gray-900 border-b border-white/10 flex flex-row">
        <button onClick={handleOpenAddModal}>
          <h1 className="text-white text-2xl hover:text-blue-500 transition-colors ml-2">
            <PlusCircle />
          </h1>
        </button>
        <p className="py-4 px-4 text-xl whitespace-nowrap">Video List</p>
      </div>

      <div className="text-white/90">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={video.id || index}
              onClick={() => onVideoSelect(video)}
              className="flex flex-row justify-between items-center bg-gray-900 border-b border-white/10 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex flex-row items-center">
                <PlayCircle className="text-blue-500 w-4 h-4 ml-4 flex-shrink-0" />
                <p className="text-sm py-3 px-3 whitespace-nowrap">
                  Video {index + 1}: {video.title}
                </p>
              </div>
              <div className="flex flex-row space-x-2 pr-4">
                <button
                  className="text-blue-500 hover:text-blue-600 transition-colors text-md"
                  onClick={(e) => handleOpenEditModal(video, e)}
                >
                  <PencilIcon />
                </button>
                <button
                  className="text-red-500 hover:text-red-600 transition-colors text-md"
                  onClick={(e) => handleOpenDeleteModal(video, e)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm p-4 text-center">
            No videos available. Click the + button to add a video.
          </div>
        )}
      </div>

      <AddVideoModal
        lessonID={numericLessonID}
        courseId={numericCourseID}
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onUpdate={handleVideoUpdate}
      />

      {selectedVideo && (
        <>
          <EditVideoModal
            courseId={numericCourseID}
            lessonId={numericLessonID}
            videoId={selectedVideo.id}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onUpdate={handleVideoUpdate}
          />

          <DeleteVideoModal
            courseId={numericCourseID}
            lessonId={numericLessonID}
            videoId={selectedVideo.id}
            videoTitle={selectedVideo.title}
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onDelete={handleVideoUpdate}
          />
        </>
      )}
    </div>
  );
}
