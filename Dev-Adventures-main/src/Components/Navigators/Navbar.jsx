/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.courseData;

  const isCourseDetailsPage = location.pathname.startsWith("/course/");
  const isHomePage = location.pathname === "/";
  const isProfilePage = location.pathname === "/profile";

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

  const navigateWithLoading = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(path);
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

  const getNavItems = () => {
    const pathToItems = {
      "/": [
        { label: "Plans", path: "/plans" },
        { label: "Courses", path: "/courses" },
      ],
      "/courses": [{ label: "Plans", path: "/plans" }],
      "/cart": [
        { label: "Plans", path: "/plans" },
        { label: "Courses", path: "/courses" },
      ],
      "/profile": [
        { label: "About", path: "/about" },
        { label: "Services", path: "/services" },
        { label: "Contact", path: "/contact" },
      ],
    };

    return pathToItems[location.pathname] || pathToItems["/"];
  };

  const renderBrandLogo = () => (
    <button
      onClick={() => navigateWithLoading("/")}
      className="text-white font-bold text-3xl italic mr-8 hover:text-gray-300 transition-colors"
    >
      DeV.
    </button>
  );

  const renderNavLinks = () => {
    if (isCourseDetailsPage) {
      return (
        <div className="flex items-center">
          <h1 className="text-white font-bold text-xl">
            {courseData?.title || "Course Title"}
          </h1>
          <div className="flex items-center space-x-3 ml-4 text-sm">
            <span className="text-blue-500">
              ★ {courseData?.rating || "0.0"}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">
              {courseData?.students || "0"} students
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex space-x-6">
        {getNavItems().map((item) => (
          <button
            key={item.path}
            className="text-white font-bold text-2xl hover:text-gray-400 transition-colors"
            onClick={() => navigateWithLoading(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  };

  const renderSearchBar = () => {
    if (!isCourseDetailsPage && ["/", "/courses"].includes(location.pathname)) {
      return (
        <div className="flex-1 max-w-xl mx-auto px-8">
          <div className="flex bg-gray-600 rounded-full border border-gray-600">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Browse our courses..."
              className="w-full bg-transparent px-6 py-2 rounded-full border-none focus:outline-none text-white"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderAuthSection = () => {
    if (isCourseDetailsPage) {
      return (
        <button className="px-6 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 transition-colors">
          Start Learning
        </button>
      );
    }

    if (isProfilePage) {
      return (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-red-600 hover:border-red-600 transition-colors"
        >
          Log out
        </button>
      );
    }

    if (userData) {
      return (
        <div className="flex items-center">
          <p className="text-white mx-4">Welcome, {userData.name}!</p>
          <button
            onClick={() => navigateWithLoading("/cart")}
            className="hover:text-gray-400 transition-colors"
          >
            <ShoppingCart className="text-white" />
          </button>
          {!isProfilePage && (
            <button
              onClick={() => navigateWithLoading("/profile")}
              className="ml-4"
            >
              <img
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                src="/api/placeholder/40/40"
                alt="Profile avatar"
              />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          className="px-4 py-2 bg-gray-800 text-white border border-gray-800 rounded hover:bg-gray-700 transition-colors"
          onClick={() => navigateWithLoading("/login")}
        >
          Login
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 transition-colors"
          onClick={() => navigateWithLoading("/signup")}
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black py-3 px-4 shadow-md backdrop-blur-md bg-opacity-80">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex items-center">
            {renderBrandLogo()}
            {renderNavLinks()}
          </div>

          {renderSearchBar()}

          <div className="flex items-center">{renderAuthSection()}</div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
