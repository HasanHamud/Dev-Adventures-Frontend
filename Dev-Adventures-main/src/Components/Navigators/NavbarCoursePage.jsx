import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import meImage from "../../Assets/images/Me.jpg";

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

  const handleProfileClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/profile");
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
    <div className="flex flex-row bg-black py-3 px-4 shadow-md">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center w-1/3">
        <h1 className="text-white font-bold text-3xl italic mr-8">DeV.</h1>
        <div className="flex space-x-6">
          <button
            className="text-white font-bold text-2xl"
            onClick={handlePlansButton}
          >
            Plans
          </button>
          <button
            className="text-white font-bold text-2xl"
            onClick={handleHomeButton}
          >
            Home
          </button>
        </div>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="flex-1 max-w-xl mx-auto px-8">
        <div className="flex bg-gray-600 rounded-full border border-gray-600">
          <input
            placeholder="Browse our courses..."
            className="w-full bg-transparent px-6 py-2 rounded-full border-none focus:outline-none text-white"
          />
        </div>
      </div>

      {/* Right section: Cart */}
      <div className="flex justify-end items-center w-1/3">
        <button
          onClick={handleCartButton}
          className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>

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
};

export default NavbarCoursePage;
