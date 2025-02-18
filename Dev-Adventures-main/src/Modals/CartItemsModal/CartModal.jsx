/* eslint-disable react/prop-types */
import axios from "axios";
import { ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

export const CartModal = ({ isOpen, onClose, onViewCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        const itemsResponse = await axios.get(
          "http://localhost:5101/api/Cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const courses =
          itemsResponse.data && Array.isArray(itemsResponse.data.courses)
            ? itemsResponse.data.courses
            : [];

        const priceResponse = await axios.get(
          "http://localhost:5101/api/Cart/price",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCartItems(courses);
        setTotalPrice(priceResponse.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemoveCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5101/api/Cart/Course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const itemsResponse = await axios.get("http://localhost:5101/api/Cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courses =
        itemsResponse.data && Array.isArray(itemsResponse.data.courses)
          ? itemsResponse.data.courses
          : [];
      const priceResponse = await axios.get(
        "http://localhost:5101/api/Cart/price",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartItems(courses);
      setTotalPrice(priceResponse.data);
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Your Cart
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            Your cart is empty
          </div>
        ) : (
          <div>
            {cartItems.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-center p-4 border-b border-gray-700"
              >
                <div>
                  <h3 className="text-white font-medium">{course.title}</h3>
                  <p className="text-gray-400">${course.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemoveCourse(course.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <div>
            <span className="text-gray-400">Total:</span>
            <span className="text-white font-semibold ml-2">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-400 rounded-md hover:bg-gray-600"
            >
              Continue Shopping
            </button>
            <button
              onClick={onViewCart}
              disabled={cartItems.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};