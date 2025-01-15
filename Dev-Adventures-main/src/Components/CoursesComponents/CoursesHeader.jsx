import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function CoursesHeader() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        console.log("Decoded token:", decodedToken);

        const roles =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        const userIsAdmin = Array.isArray(roles)
          ? roles.includes("Admin")
          : roles === "Admin";

        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Programming Courses
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm">
              Start your programming journey with our structured learning paths.
            </p>
          </div>
          {isAdmin && (
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium my-2">
              Add Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
