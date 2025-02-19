/* eslint-disable react/prop-types */
import { useState } from "react";
import { PartyPopper } from "lucide-react";

const CheckoutSummary = ({ total, courseId, onCouponApplied }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
      setCheckoutStatus(null);

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

      const result = await response.json();

      setCheckoutStatus({
        enrolled: result.enrolledCourses,
        skipped: result.skippedCourses,
      });

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
    } finally {
      setIsProcessing(false);
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

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-red-400">
          <div className="font-semibold">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {checkoutStatus && (
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <div className="font-semibold">Enrollment Complete</div>
          <div className="text-sm">
            Successfully enrolled in {checkoutStatus.enrolled} new course(s)
            {checkoutStatus.skipped > 0 && (
              <>
                <br />
                Skipped {checkoutStatus.skipped} course(s) you were already
                enrolled in
              </>
            )}
          </div>
        </div>
      )}

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
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing
          ? "Processing..."
          : total === 0
          ? "Get Course for Free →"
          : "Proceed to Checkout →"}
      </button>

      {total > 0 && (
        <p className="text-sm text-gray-400">You won&apos;t be charged yet</p>
      )}
    </div>
  );
};

export default CheckoutSummary;
