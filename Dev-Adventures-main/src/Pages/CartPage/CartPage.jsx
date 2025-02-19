import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import CartItem from "../../Components/CartComponents/CartItem";
import PlanCartItem from "../../Components/CartComponents/PlanCartItem";
import CheckoutSummary from "../../Components/CartComponents/CheckoutSummary";
import Navbar from "../../Components/Navigators/Navbar";

const CartPage = () => {
  const [cartData, setCartData] = useState({
    courses: [],
    plans: [],
    totalPrice: 0
  });
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

<<<<<<< HEAD
      console.log("Cart API Response:", response.data);
      const coursesData = Array.isArray(response.data.courses)
        ? response.data.courses
        : [];

      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCourses([]);
=======
      const coursesData = Array.isArray(response.data.courses)
        ? response.data.courses
        : [];
      const plansData = Array.isArray(response.data.plans)
        ? response.data.plans.map(p => ({
            ...p.plan,
            appliedPrice: p.appliedPrice,
            dateAdded: p.dateAdded,
            includedCourses: p.plan.plansCourses?.map(pc => pc.course) || []
          }))
        : [];

      setCartData({
        courses: coursesData,
        plans: plansData,
        totalPrice: response.data.totalPrice
      });
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCartData({ courses: [], plans: [], totalPrice: 0 });
>>>>>>> 0a39faa8ce6cacaf5b3ce006a12a9c2f8b03ba9c
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRemoveCourse = useCallback(async (id) => {
    try {
      const token = localStorage.getItem("authToken");
<<<<<<< HEAD
=======
      
>>>>>>> 0a39faa8ce6cacaf5b3ce006a12a9c2f8b03ba9c
      await axios.delete(`http://localhost:5101/api/Cart/Course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
<<<<<<< HEAD

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
    } catch (err) {
=======
      setCartData(prev => ({
        ...prev,
        courses: prev.courses.filter(course => course.id !== id)
      }));
    }
     catch (err) {
>>>>>>> 0a39faa8ce6cacaf5b3ce006a12a9c2f8b03ba9c
      console.error("Error removing course:", err);
      setError("Failed to remove course.");
    }
  }, []);

  const handleRemovePlan = useCallback(async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5101/api/Cart/Plan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartData(prev => ({
        ...prev,
        plans: prev.plans.filter(plan => plan.id !== id)
      }));
    } catch (err) {
      console.error("Error removing plan:", err);
      setError("Failed to remove plan.");
    }
  }, []);

  const handleCouponApplied = useCallback((response) => {
    if (response === null) {
      // Checkout was successful, clear the cart
      setCartData({ courses: [], plans: [], totalPrice: 0 });
    } else {
      fetchCartItems(); // Refresh cart data to get updated prices
    }
  }, [fetchCartItems]);

  const calculateTotalCourses = () => {
    const individualCourses = cartData.courses.length;
    const coursesInPlans = cartData.plans.reduce((total, plan) => 
      total + (plan.includedCourses?.length || 0), 0);
    return individualCourses + coursesInPlans;
  };

  const totalItems = cartData.courses.length + cartData.plans.length;
  const totalCourses = calculateTotalCourses();

  return (
    <div className="bg-gray-800 min-h-screen text-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 pt-20">
        <h1 className="text-4xl font-bold mb-6">Shopping Cart</h1>
        {loading ? (
          <div className="text-lg text-center">Loading cart...</div>
        ) : error ? (
          <div className="text-red-400 text-lg text-center">{error}</div>
        ) : totalItems === 0 ? (
          <div className="text-lg text-center">Your cart is empty.</div>
        ) : (
          <>
            <div className="text-lg mb-6">
              {totalItems} Item{totalItems !== 1 ? 's' : ''} in Cart 
              ({totalCourses} Total Course{totalCourses !== 1 ? 's' : ''})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {cartData.courses.map((course) => (
                  <CartItem
                    key={`course-${course.id}`}
                    course={course}
                    onRemove={handleRemoveCourse}
                  />
                ))}
                {cartData.plans.map((plan) => (
                  <PlanCartItem
                    key={`plan-${plan.id}`}
                    plan={plan}
                    onRemove={handleRemovePlan}
                  />
                ))}
              </div>
              <CheckoutSummary
                total={cartData.totalPrice}
                courseId={cartData.courses.length > 0 ? cartData.courses[0].id : null}
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