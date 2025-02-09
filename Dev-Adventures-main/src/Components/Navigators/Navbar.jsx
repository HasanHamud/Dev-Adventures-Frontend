import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.courseData;
  const isCourseDetailsPage = location.pathname.startsWith("/course/");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
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

  const renderNavItems = () => {
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

    const navItems = {
      "/courses": [
        { label: "Plans", path: "/plans" },
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },

      ],
      "/cart": [
        { label: "Plans", path: "/plans" },
        { label: "Courses", path: "/courses" },
        { label: "About", path: "/about" },

      ],
      "/profile": [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Services", path: "/services" },
        { label: "Contact", path: "/contact" },
        { label: "About", path: "/about" },
      ],

      "/about": [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Services", path: "/services" },
        { label: "Contact", path: "/contact" },

      ],
      default: [
        { label: "Plans", path: "/plans" },
        { label: "Courses", path: "/courses" },
        { label: "About", path: "/about" },

      ],
    };

    return (navItems[location.pathname] || navItems.default).map((item) => (
      <button
        key={item.path}
        className="text-white font-bold text-2xl hover:text-gray-400"
        onClick={() => navigateWithLoading(item.path)}
      >
        {item.label}
      </button>
    ));
  };

  const renderRightSection = () => {
    if (isCourseDetailsPage) {
      return (
        <button className="px-6 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 transition-colors">
          Start Learning
        </button>
      );
    }

    if (location.pathname === "/profile") {
      return (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-red-600 hover:border-red-600"
        >
          Log out
        </button>
      );
    }

    return (
      <div className="flex items-center">
        {userData ? (
          <div className="flex items-center">
            <p className="text-white mx-4">Welcome, {userData.name}!</p>
            <button onClick={() => navigateWithLoading("/cart")}>
              <ShoppingCart className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 bg-gray-800 text-white border border-gray-800 rounded hover:bg-gray-700"
              onClick={() => navigateWithLoading("/login")}
            >
              Login
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600"
              onClick={() => navigateWithLoading("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSearchBar = () => {
    if (!isCourseDetailsPage && ["/", "/courses"].includes(location.pathname)) {
      return (
        <div className="flex-1 max-w-xl mx-auto px-8">
          <div className="flex bg-gray-600 rounded-full border border-gray-600">
            <input
              placeholder="Browse our courses..."
              className="w-full bg-transparent px-6 py-2 rounded-full border-none focus:outline-none text-white"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black py-3 px-4 shadow-md backdrop-blur-md bg-opacity-80">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex items-center">
            <button onClick={() => navigateWithLoading("/")}>
              <h1 className="text-white font-bold text-3xl italic mr-8">
                DeV.
              </h1>
            </button>
            <div className="flex space-x-6">{renderNavItems()}</div>
          </div>

          {renderSearchBar()}

          <div className="flex items-center">{renderRightSection()}</div>
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
