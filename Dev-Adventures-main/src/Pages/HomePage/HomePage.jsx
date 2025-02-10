import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Features from "../../Components/HomePageComponents/Features";
import Foot from "../../Components/HomePageComponents/Foot";
import HomeCourse from "../../Components/HomePageComponents/HomeCourse";
import Level from "../../Components/HomePageComponents/StartingLevel";
import Navbar from "../../Components/Navigators/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Content container */}
      <div className="relative">
        {/* Navbar */}
        <div className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-blue-500/10">
          <Navbar />
        </div>

        {/* Header */}
        <header className="relative flex flex-row items-center justify-between px-12 h-screen overflow-hidden pt-20">
          <div className="w-1/2">
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-5xl mb-4 font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
                Learn, Code, Connect
              </h1>
              <div className="flex flex-col items-start justify-start mb-6">
                <p className="text-blue-100 text-2xl">
                  We Connect Students And Instructors
                </p>
                <p className="text-blue-100 text-2xl mb-6">
                  To Bring Software Innovation
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

          {/* Logo Display with smoother glow */}
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

        {/* Features Section */}
        <div className="min-h-screen relative">
          <div className="relative">
            <Features />
          </div>
        </div>

        {/* Courses Section with distinct background */}
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
                <HomeCourse
                  text="Python Programming Essentials"
                  text2="A comprehensive introduction to Python, covering syntax, data types, control flow, functions, and basic..."
                />
                <HomeCourse
                  text="Data Structures and Algorithms"
                  text2="A deep dive into the fundamentals of data structures and algorithms"
                />
                <HomeCourse
                  text="Mastering Javascript"
                  text2="A step by step guide to mastering javascript from zero to hero"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Levels Section with distinct background */}
        <div className="min-h-screen py-20 relative bg-gray-900">
          <div className="relative">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
                Our Roadmaps
              </h1>
            </div>
            <div className="flex flex-row justify-center space-x-8 px-12">
              <Level
                title="Beginner"
                feature1="Coding Fundamentals"
                feature2="Getting Familiar with an IDE"
                feature3="Build your first functional Project"
              />
              <Level
                title="Intermediate"
                feature1="Get familiar with OOP"
                feature2="Learn what data structures are"
                feature3="Algorithms and their purpose"
              />
              <Level
                title="Advanced"
                feature1="Multiple Paths"
                feature2="Detailed Instructions"
                feature3="CV approved functional projects"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative bg-black/80 backdrop-blur-sm border-t border-blue-500/10">
          <Foot />
        </footer>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
