import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoSideBar from "../../../Components/LessonDetails/VideoSideBar";
import { VideoBox } from "../../../Components/LessonDetails/VideoBox";
import { ArrowBigRight, ArrowBigLeft, ChevronDown, ChevronUp } from "lucide-react";

export default function LessonDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const COURSE_ID = 1;

  const [lesson, setLesson] = useState(location.state?.lessonData || null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lessonError, setLessonError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allLessons, setAllLessons] = useState([]);

  const MAX_CHARS = 150;

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const lessonsResponse = await axios.get(
          `http://localhost:5101/api/lesson/Courses/${COURSE_ID}`,
          { headers }
        );
        setAllLessons(lessonsResponse.data);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      }
    };

    fetchAllLessons();
  }, [COURSE_ID]);

  useEffect(() => {
    if (location.state?.lessonData) {
      setLesson(location.state.lessonData);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      if (!lesson) {
        setLessonError("No lesson data provided");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        setLessonError("No authentication token found. Please log in");
        setIsLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const videosResponse = await axios.get(
          `http://localhost:5101/api/lesson/${COURSE_ID}/${lesson.id}`,
          { headers }
        );
        setVideos(videosResponse.data);
        // Set the first video as current video when videos are loaded
        if (videosResponse.data.length > 0) {
          setCurrentVideo(videosResponse.data[0]);
        }
        setVideoError(null);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideoError("Unable to load video content");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lesson, COURSE_ID]);

 const handleNextLesson = () => {
  const currentIndex = allLessons.findIndex(l => l.id === lesson?.id);
  if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
    const nextLesson = allLessons[currentIndex + 1];
    navigate("/lesson/lessondetails", { 
      state: { lessonData: nextLesson }
    });
    window.location.reload(); // Add this line to refresh
  }
};

const handlePreviousLesson = () => {
  const currentIndex = allLessons.findIndex(l => l.id === lesson?.id);
  if (currentIndex > 0) {
    const previousLesson = allLessons[currentIndex - 1];
    navigate("/lesson/lessondetails", { 
      state: { lessonData: previousLesson }
    });
    window.location.reload(); // Add this line to refresh
  }
};

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const currentIndex = allLessons.findIndex(l => l.id === lesson?.id);
  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === allLessons.length - 1;

  const shouldShowButton = lesson?.description?.length > MAX_CHARS;
  const displayText = isExpanded
    ? lesson?.description
    : lesson?.description?.slice(0, MAX_CHARS) + "...";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (lessonError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 bg-gray-800 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Error Loading Lesson</h2>
          <p>{lessonError}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-row justify-around">
      <div className="p-8 ml-8 flex-1">
        <div className="flex flex-row space-x-3 text-center mb-6">
          <h1 className="text-white text-2xl font-bold">{lesson.title}</h1>
        </div>

        <div className="mb-8">
          {videoError ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
              {videoError}
            </div>
          ) : currentVideo ? (
            <VideoBox youtubeUrl={currentVideo.videoURL} />
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-4 text-gray-400">
              No video content available for this lesson
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 max-w-3xl">
          <h2 className="text-white text-lg font-medium mb-3">Description</h2>
          <p className="text-gray-400 leading-relaxed">
            {displayText}
            {shouldShowButton && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-blue-500 hover:text-blue-400 mt-2 transition-colors gap-1"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </p>
        </div>
      </div>
      <div className="p-4 mt-2 flex flex-col justify-start">
        <div className="flex justify-end mb-6 space-x-4">
          {!isFirstLesson && (
            <button
              onClick={handlePreviousLesson}
              className="w-44 flex text-white border-blue-500 border-2 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-200 py-3 rounded-md items-center group"
            >
              <p className="px-2 text-blue-500 group-hover:-translate-x-1 transition-transform">
                <ArrowBigLeft />
              </p>
              <p className="text-lg text-white text-center">Previous Lesson</p>
            </button>
          )}
          {!isLastLesson && (
            <button
              onClick={handleNextLesson}
              className="w-44 flex text-white border-blue-500 border-2 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-200 py-3 rounded-md items-center group"
            >
              <p className="px-2 text-blue-500 group-hover:translate-x-1 transition-transform">
                <ArrowBigRight />
              </p>
              <p className="text-lg text-white text-center">Next Lesson</p>
            </button>
          )}
        </div>
        <VideoSideBar 
          videos={videos} 
          title={lesson.title} 
          lessonID={lesson.id} 
          courseID={COURSE_ID}
          onVideoSelect={handleVideoSelect}
        />
      </div>
    </div>
  );
}