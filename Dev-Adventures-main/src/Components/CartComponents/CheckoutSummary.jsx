/* eslint-disable react/prop-types */
import { useState } from "react";
import { PartyPopper } from "lucide-react";

const CheckoutSummary = ({ total, courseId, onCouponApplied }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    try {
      setError("");
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please log in to apply a coupon.");
        return;
      }

      const response = await fetch("http://localhost:5101/api/Coupon/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ couponCode, courseId }),
      });

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error((await response.text()) || "Coupon apply failed");
      }

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (onCouponApplied) {
          onCouponApplied(courseId);
        }
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred while applying the coupon");
      console.error("Coupon error:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      setError("");

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please log in to continue");
        return;
      }

      const response = await fetch("http://localhost:5101/api/Cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error((await response.text()) || "Checkout failed");
      }

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (onCouponApplied) {
          onCouponApplied(null);
        }
      }, 3000);
    } catch (error) {
      setError(error.message || "An error occurred during checkout");
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="relative text-white space-y-6">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center animate-bounce">
          <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg" />
          <PartyPopper className="w-16 h-16 text-yellow-400" />
        </div>
      )}

      <h2 className="text-3xl font-bold">Total:</h2>
      <div className="text-4xl font-extrabold text-blue-400">
        {total === 0 ? "FREE!" : `$${total.toFixed(2)}`}
      </div>

      {error && <div className="text-red-400 text-sm py-2">{error}</div>}

      {/* Coupon Input Field */}
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="p-2 rounded border border-gray-300 text-black"
        />
        <button
          onClick={handleApplyCoupon}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Apply Coupon
        </button>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-700 transition-colors"
      >
        {total === 0 ? "Get Course for Free →" : "Proceed to Checkout →"}
      </button>

      {total > 0 && (
        <p className="text-sm text-gray-400">You won&apos;t be charged yet</p>
      )}
    </div>
  );
};

export default CheckoutSummary;
