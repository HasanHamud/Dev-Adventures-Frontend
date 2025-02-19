/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Features from "../../Components/HomePageComponents/Features";
import Foot from "../../Components/HomePageComponents/Foot";
import HomeCourse from "../../Components/HomePageComponents/HomeCourse";
import Level from "../../Components/HomePageComponents/StartingLevel";
import Navbar from "../../Components/Navigators/Navbar";
import Logo from "../../Assets/images/Logo.png";
import ChatWidget from "../../Components/ChatComponent/Chat";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [HomeCourses, setHomeCourses] = useState([]);
  const token = localStorage.getItem('authToken');

  const fetchHomeLessons = async () => {
    try {
      const response = await axios.get(`http://localhost:5101/api/Courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const courses = response.data;

      if (courses.length === 0) return; // No courses available

      const selectedCourses = [];
      const usedIndexes = new Set();

      while (selectedCourses.length < Math.min(3, courses.length)) {
        const randomIndex = Math.floor(Math.random() * courses.length);
        if (!usedIndexes.has(randomIndex)) {
          selectedCourses.push(courses[randomIndex]);
          usedIndexes.add(randomIndex);
        }
      }

      setHomeCourses(selectedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchHomeLessons();
  }, []);

  const handleJoinNowClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        navigate("/plans");
      } else {
        navigate("/login");
      }
    }, 1000);
  };

  const navigateWithLoading = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(path);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative">
        <Navbar navigateWithLoading={navigateWithLoading} />

        <header className="relative flex flex-row items-center justify-between px-12 h-screen overflow-hidden pt-20">
          <div className="w-1/2">
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-5xl mb-4 font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
                DeV Adventures
              </h1>
              <div className="flex flex-col items-start justify-start mb-6">
                <p className="text-blue-100 text-2xl">
                  Explore( ).Learn( ).Code( );
                </p>
              </div>

              <div className="space-x-4 flex items-center justify-start">
                <button
                  onClick={handleJoinNowClick}
                  className="text-white text-xl bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                >
                  Join Now
                </button>
                <button className="text-white text-xl border border-blue-400/30 px-8 py-3 rounded-lg hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm">
                  Our Services
                </button>
              </div>
            </div>
          </div>

          <div className="w-1/2 h-full flex items-center justify-center relative">
            <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute w-64 h-64 bg-blue-400/5 rounded-full blur-2xl"></div>
            <div className="relative w-96 h-96 animate-float">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              />
            </div>
          </div>
        </header>

        <div className="min-h-screen relative">
          <div className="relative">
            <Features />
          </div>
        </div>

        {/* Courses Section */}
        <div className="min-h-screen py-20 relative bg-gray-800/50">
          <div className="relative">
            <div className="flex flex-col items-center justify-center gap-6 text-white">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200 mb-4">
                  Our Courses
                </h1>
                <h2 className="text-2xl text-blue-100">
                  Start your journey to become a 10x Developer
                </h2>
              </div>
              <div className="flex flex-row space-x-20 px-12">
  {HomeCourses.length > 0 ? (
    HomeCourses.map((course) => {
      console.log("Course Image URL:", `http://localhost:5101${course.imgURL}`); // Logging the correct image URL

      return (
        <HomeCourse
          key={course.id}
          text={course.title}
          text2={course.description}
          imgUrl={`http://localhost:5101${course.imgURL}`} // Correct implementation
        />
      );
    })
  ) : (
    <p className="text-blue-200 text-xl">Loading courses...</p>
  )}
</div>

            </div>
          </div>
        </div>

        {/* Levels Section */}
        <div className="min-h-screen py-20 relative bg-gray-900">
          <div className="relative">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
                Our Roadmaps
              </h1>
            </div>
            <div className="flex flex-row justify-center space-x-8 px-12">
              <Level
                title="Beginner (WIP)"
                feature1="Coding Fundamentals"
                feature2="Getting Familiar with an IDE"
                feature3="Build your first functional Project"
              />
              <Level
                title="Intermediate (WIP)"
                feature1="Get familiar with OOP"
                feature2="Learn what data structures are"
                feature3="Algorithms and their purpose"
              />
              <Level
                title="Advanced (WIP)"
                feature1="Multiple Paths"
                feature2="Detailed Instructions"
                feature3="CV approved functional projects"
              />
            </div>
          </div>
        </div>

        <footer className="relative bg-black/80 backdrop-blur-sm border-t border-blue-500/10">
          <Foot />
        </footer>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <ChatWidget />
    </div>
  );
};

export default HomePage;
