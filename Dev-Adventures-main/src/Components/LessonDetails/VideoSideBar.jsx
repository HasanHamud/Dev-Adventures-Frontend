/* eslint-disable no-unused-vars */
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
  currentVideo,
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
    <div className="w-64 bg-gray-900 flex flex-col text-white h-full rounded-lg overflow-hidden">
      {/* Top bar with Add button */}
      <div className="bg-gray-900 border-b border-white/10 flex items-center">
        <button onClick={handleOpenAddModal} className="ml-2">
          <PlusCircle className="text-white text-2xl hover:text-blue-500 transition-colors" />
        </button>
        <p className="py-4 px-4 text-xl">Video List</p>
      </div>

      {/* Video list */}
      <div className="text-white/90 overflow-y-auto">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={video.id || index}
              onClick={() => onVideoSelect(video)}
              className="border-b border-white/10 bg-gray-900 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Left side with icon and text */}
                  <div className="flex items-start gap-2 flex-1">
                    <PlayCircle className="text-blue-500 w-4 h-4 flex-shrink-0 mt-1" />
                    <p className="text-sm break-words">
                      Video {index + 1}: {video.title}
                    </p>
                  </div>

                  {/* Right side with action buttons */}
                  <div className="flex items-start space-x-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleOpenEditModal(video, e)}
                      className="text-blue-500 hover:text-blue-600 p-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleOpenDeleteModal(video, e)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm p-4 text-center">
            No videos available. Click the + button to add a video.
          </div>
        )}
      </div>

      {/* Modals */}
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
