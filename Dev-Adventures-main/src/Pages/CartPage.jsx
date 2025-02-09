import { useState } from "react";
import CartItem from "../../Components/CartComponents/CartItem";
import Navbar from "../../Components/Navigators/Navbar";
import CheckoutSummary from "../../Components/CartComponents/CheckoutSummary";

const CartPage = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Complete PHP from Scratch for Beginners",
      instructor: "Srini Vanamala",
      rating: 4.3,
      reviews: 604,
      totalHours: 17.5,
      lectures: 202,
      level: "Beginner",
      price: 13.99,
      originalPrice: 64.99,
    },
  ]);
  const [coupon, setCoupon] = useState("ST5MT020225AROW");

  const handleRemove = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleApplyCoupon = () => {
    alert("Coupon applied!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 min-h-screen text-gray-100">
      <Navbar />
      <h1 className="text-4xl font-bold mt-8 mb-6">Shopping Cart</h1>
      <div className="text-lg mb-6">{courses.length} Course in Cart</div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {courses.map((course) => (
            <CartItem key={course.id} course={course} onRemove={handleRemove} />
          ))}
        </div>

        <CheckoutSummary
          total={courses.reduce((sum, course) => sum + course.price, 0)}
          coupon={coupon}
          setCoupon={setCoupon}
          onApplyCoupon={handleApplyCoupon}
        />
      </div>
    </div>
  );
};

export default CartPage;
