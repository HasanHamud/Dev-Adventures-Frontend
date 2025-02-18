import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import CartItem from "../../Components/CartComponents/CartItem";
import CheckoutSummary from "../../Components/CartComponents/CheckoutSummary";
import Navbar from "../../Components/Navigators/Navbar";

const CartPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5101/api/Cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Cart API Response:", response.data);
      const coursesData = Array.isArray(response.data.courses)
        ? response.data.courses
        : [];

      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCourses([]);
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRemove = useCallback(async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5101/api/Cart/Course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
    } catch (err) {
      console.error("Error removing course:", err);
      setError("Failed to remove course.");
    }
  }, []);

  const handleCouponApplied = (couponCourseId) => {
    if (couponCourseId === null) {
      setCourses([]);
    } else {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === couponCourseId ? { ...course, price: 0 } : course
        )
      );
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen text-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 pt-20">
        <h1 className="text-4xl font-bold mb-6">Shopping Cart</h1>

        {loading ? (
          <div className="text-lg text-center">Loading cart...</div>
        ) : error ? (
          <div className="text-red-400 text-lg text-center">{error}</div>
        ) : courses.length === 0 ? (
          <div className="text-lg text-center">Your cart is empty.</div>
        ) : (
          <>
            <div className="text-lg mb-6">
              {courses.length} Course(s) in Cart
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {courses.map((course) => (
                  <CartItem
                    key={course.id}
                    course={course}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
              <CheckoutSummary
                total={courses.reduce((sum, course) => sum + course.price, 0)}
                courseId={courses.length > 0 ? courses[0].id : null}
                onCouponApplied={handleCouponApplied}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
