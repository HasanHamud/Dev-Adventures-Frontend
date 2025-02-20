/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  PlayCircle,
  PlusCircle,
  PencilIcon,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AddVideoModal from "../../Modals/LessonDetailsModals/AddVideoModal";
import EditVideoModal from "../../Modals/LessonDetailsModals/EditVideoModal";
import DeleteVideoModal from "../../Modals/LessonDetailsModals/DeleteVideoModal";
import axios from "axios";

export default function VideoSideBar({
  videos = [],
  lessonID,
  courseID,
  onVideoSelect,
  onVideoCompletion,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const numericLessonID = Number(lessonID);
  const numericCourseID = Number(courseID);

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found");
        return;
      }
      const decodedToken = jwtDecode(token);
      const uid = decodedToken.sub || decodedToken.userId;
      if (!uid) {
        setError("User ID not found in token");
        return;
      }
      setUserId(uid);
    } catch (error) {
      setError("Invalid authentication token");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCompletedVideos();
    }
  }, [userId]);

  const fetchCompletedVideos = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.get(
        `http://localhost:5101/api/progress/video/complete?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCompletedVideos(response.data.completedVideoIds);
    } catch (error) {
      console.error("Error fetching completed videos:", error);
      setError("Failed to fetch completed videos");
    }
  };

  const handleMarkCompleted = async (videoId, e) => {
    e.stopPropagation();
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const requestBody = {
        userId: userId,
        videoId: videoId,
      };

      await axios.post(
        "http://localhost:5101/api/progress/video/complete",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompletedVideos((prev) => [...prev, videoId]);

      // Notify parent components about video completion
      if (onVideoCompletion) {
        const allVideosCompleted = videos.every((video) =>
          [...completedVideos, videoId].includes(video.id)
        );
        onVideoCompletion(videoId, allVideosCompleted);
      }
    } catch (error) {
      console.error("Error marking video as completed:", error);
      setError("Failed to mark video as completed");
    }
  };

  if (error) {
    return <div className="w-64 bg-gray-900 p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-64 bg-gray-900 flex flex-col text-white h-full rounded-lg overflow-hidden">
      {/* Top bar with Add button */}
      <div className="bg-gray-900 border-b border-white/10 flex items-center">
        <button onClick={() => setIsAddModalOpen(true)} className="ml-2">
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
              className="border-b border-white/10 bg-gray-900 hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <PlayCircle className="text-blue-500 w-4 h-4 flex-shrink-0" />
                <p className="text-sm break-words">
                  Video {index + 1}: {video.title}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleMarkCompleted(video.id, e)}
                  className="text-green-500 hover:text-green-600"
                >
                  {completedVideos.includes(video.id) ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(video);
                    setIsEditModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(video);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
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

      {/* Modals */}
      <AddVideoModal
        lessonID={numericLessonID}
        courseId={numericCourseID}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUpdate={fetchCompletedVideos}
      />

      {selectedVideo && (
        <>
          <EditVideoModal
            courseId={numericCourseID}
            lessonId={numericLessonID}
            videoId={selectedVideo.id}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={fetchCompletedVideos}
          />
          <DeleteVideoModal
            courseId={numericCourseID}
            lessonId={numericLessonID}
            videoId={selectedVideo.id}
            videoTitle={selectedVideo.title}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={fetchCompletedVideos}
          />
        </>
      )}
    </div>
  );
}
