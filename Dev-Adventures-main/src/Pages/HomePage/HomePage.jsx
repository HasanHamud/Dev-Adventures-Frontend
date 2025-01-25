import LottieAnimation from "lottie-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeimage from "../../Assets/images/HomeImage.json";
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
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <header className="text-start  flex flex-row items-center justify-center h-screen w-full">
        <div className="flex-grow flex flex-col items-center justify-start">
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-white text-4xl mb-1 font-bold">
              Learn, Code, Connect
            </h1>
            <div className="flex flex-col items-start justify-start mb-2">
              <p className="text-white text-xl">
                We Connect Students And Instructors{" "}
              </p>
              <p className="text-white text-xl mb-2">
                To Bring Software Innovation
              </p>
            </div>

            <div className="space-x-3 flex items-center justify-start">
              <button
                onClick={handleJoinNowClick}
                className="text-white text-xl border bg-blue-500 border-blue-500 px-6 py-1 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Join Now
              </button>
              <button className="text-white text-xl border bg-gray-800 border-gray-800 px-6 py-1 rounded-xl">
                {" "}
                Our Services{" "}
              </button>
            </div>
          </div>
        </div>
        <div className=" flex-grow -z-10">
          <LottieAnimation
            className=" w-5/6"
            animationData={homeimage}
            loop={true}
          ></LottieAnimation>
        </div>
      </header>

      {/*Card Section */}
      {/* {/* <section className='flex flex-col md:flex-row justify-evenly mb-6'>
        <Card
          url="https://cdn-icons-png.flaticon.com/512/2883/2883939.png"
          title="Teacher"
          description="This is the Teacher's plan"
        />
        <Card
          url="https://cdn-icons-png.flaticon.com/512/2784/2784403.png"
          title="Student"
          description="This is the Student's plan"
        />
      </section> */}

      {/* Features Section */}
      <div className="h-screen">
        <Features />
      </div>

      <div className="flex flex-col items-center justify-center gap-6 text-white h-screen">
        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold">Our Courses</h1>
          <h1 className="text-xl">
            Start your journey to become a 10x Developer
          </h1>
        </div>
        <div className="flex flex-row space-x-20 my-24">
          <HomeCourse
            text="Python Programming Essentials"
            text2="A comprehensive introduction to Python, covering syntax, data types, control flow, functions, and basic..."
          />
          <HomeCourse
            text="Data Structures and Algorithms"
            text2="A comprehensive introduction to Python, covering syntax, data types, control flow, functions, and basic..."
          />
          <HomeCourse
            text="Mastering Javascript"
            text2="A comprehensive introduction to Python, covering syntax, data types, control flow, functions, and basic..."
          />
        </div>
      </div>

      {/* Levels Section */}
      <div className="flex flex-col justify-evenly  bg-gray-700 bg-opacity-45 h-screen">
        <div className="text-white text-2xl text-center flex-col mt-5">
          <h1 className="text-3xl font-bold"> Our Roadmaps</h1>
        </div>
        <div className=" flex flex-row justify-center space-x-5 mb-10">
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

      {/* Footer */}
      <footer className="-mt-pxs">
        <Foot />
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
