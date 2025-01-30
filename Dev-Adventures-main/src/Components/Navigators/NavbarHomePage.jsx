"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import meImage from "../../Assets/images/Me.jpg";
import { ShoppingCart } from "lucide-react";

function NavbarHomePage() {
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData({
        name: parsedData.fullName || parsedData.name,
        id: parsedData.id,
      });
    }
  }, []);

  const handleCartClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/cart");
    }, 1000);
  };

  const handleHomeClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1000);
  };

  const handleSignUpClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/signup");
    }, 1000);
  };

  const handleProfileClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/profile");
    }, 1000);
  };

  const handlePlansClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/plans");
    }, 1000);
  };
  const handleAboutClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/about");
    }, 1000);
  };

  const handleCoursesClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/courses");
    }, 1000);
  };

  return (
    <div className="flex flex-row bg-black py-3 px-4 shadow-md">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center w-1/3">
      <button onClick={handleHomeClick}>
      <h1 className="text-white font-bold text-3xl italic mr-8">DeV.</h1>

      </button>
        <div className="flex space-x-6">
          <button
            className="text-white font-bold text-2xl"
            onClick={handlePlansClick}
          >
            Plans
          </button>
          <button
            className="text-white font-bold text-2xl"
            onClick={handleCoursesClick}
          >
            Courses
          </button>

          <button
            className="text-white font-bold text-2xl"
            onClick={handleAboutClick}
          >
            About
          </button>
        </div>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="flex justify-center w-1/3">
        <div className="flex bg-gray-600 rounded-full border border-gray-600 w-full max-w-xl">
          <input
            placeholder="Browse our courses..."
            className="w-full bg-transparent px-6 py-1 rounded-full border-none focus:outline-none text-white"
          />
        </div>
      </div>

      {/* Right Section - Auth Buttons and Profile */}
      <div className="flex justify-end items-center w-1/3">
        {userData ? (
          <div className="flex items-center flex-row text-white">
            <p className="text-white mx-4">Welcome, {userData.name}!</p>
            <button onClick={handleCartClick}>
              {" "}
              <ShoppingCart />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 bg-gray-800 text-white border border-gray-800 rounded hover:bg-gray-700"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
        )}
        <img
          className="w-10 h-10 rounded-full cursor-pointer ml-4"
          src={meImage}
          alt="Profile avatar"
          onClick={handleProfileClick}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default NavbarHomePage;
