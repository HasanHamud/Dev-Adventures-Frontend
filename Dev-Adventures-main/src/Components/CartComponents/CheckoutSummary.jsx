/* eslint-disable react/prop-types */

const CheckoutSummary = ({ total, coupon, setCoupon, onApplyCoupon }) => {
  const originalPrice = 64.99;
  const savings = ((originalPrice - total) / originalPrice) * 100;

  return (
    <div className="text-white space-y-6">
      <h2 className="text-3xl font-bold">Total:</h2>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-extrabold text-blue-400">${total}</div>
        <div className="text-gray-500 line-through text-lg">
          ${originalPrice}
        </div>
      </div>
      <div className="text-green-500 font-semibold">
        {savings.toFixed(0)}% off
      </div>

      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-700">
        Proceed to Checkout →
      </button>
      <p className="text-sm text-gray-400">You won&apos;t be charged yet</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-lg">Promotions</h3>
        {coupon && (
          <div className="flex items-center gap-2 text-sm bg-gray-700 p-3 rounded mb-4">
            <span className="text-gray-300">{coupon} is applied</span>
            <button
              className="ml-auto text-gray-400 hover:text-gray-200"
              onClick={() => setCoupon("")}
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Coupon"
            className="flex-grow p-3 border border-gray-600 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={onApplyCoupon}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
