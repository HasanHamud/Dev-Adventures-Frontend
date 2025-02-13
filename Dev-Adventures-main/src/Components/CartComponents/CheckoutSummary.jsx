/* eslint-disable react/prop-types */

const CheckoutSummary = ({ total }) => {
  return (
    <div className="text-white space-y-6">
      <h2 className="text-3xl font-bold">Total:</h2>
      <div className="text-4xl font-extrabold text-blue-400">
        ${total.toFixed(2)}
      </div>
      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-700">
        Proceed to Checkout →
      </button>
      <p className="text-sm text-gray-400">You won&apos;t be charged yet</p>
    </div>
  );
};

export default CheckoutSummary;
