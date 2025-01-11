/* eslint-disable react/prop-types */
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";

const NavbarCoursePage = () => {
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const handleHomeButton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  const handlePlansButton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/plans");
    }, 1000);
  };

  const handleCartButton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/cart");
    }, 1000);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto py-4 ">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo */}
          <div className="flex-shrink-0">
            <button className="text-white hover:text-blue-500 transition-colors">
              <span className="font-bold italic text-xl">DeV.</span>
            </button>
          </div>

          {/* Middle section: Navigation */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="flex space-x-4">
              <button
                onClick={handleHomeButton}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={handlePlansButton}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Plans
              </button>
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
          </div>

          {/* Right section: Cart */}
          <div className="flex items-center">
            <button
              onClick={handleCartButton}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </nav>
  );
};

export default NavbarCoursePage;
