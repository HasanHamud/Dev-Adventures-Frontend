"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavbarProfilePage() {
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const handleHomePage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="fixed top-0 left-0 w-screen  py-3  shadow-md bg-black">
      <div className="w-full flex flex-row gap-4 items-center px-10">
        <button
          className="text-white text-xl hover:text-gray-500"
          onClick={handleHomePage}
        >
          Home
        </button>
        <button className="text-white text-xl hover:text-gray-500">
          About
        </button>
        <button className="text-white text-xl hover:text-gray-500">
          Services
        </button>
        <button className="text-white text-xl hover:text-gray-500">
          Contact
        </button>
        <div className="flex-grow" />
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-red-600 hover:border-red-600"
        >
          Log out
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default NavbarProfilePage;
