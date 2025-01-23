import { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "../../Components/CartComponents/CartItem";
import CheckBox from "../../Components/CartComponents/CheckBox";
import NavbarCartPage from "../../Components/Navigators/NavbarCartPage";

const CartPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [totalprice, setTotalprice] = useState(0)



const fetchTotalPrice = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    setError("No authenticayion token found. Please log in");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:5101/api/Cart/price`, {
      headers: {
        'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
    });
    setTotalprice(response.data);
    setError(null);
  }
  catch (error) {
    console.error("error shou bi3arefne", error.response || error)
    setError(error.response?.data || "Failed to fetch cart items. Please try again.");
setTotalprice(0)  }

 
}

  
  const fetchCartItems = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get('http://localhost:5101/api/Cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setCourses(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch cart items:", error.response || error);
      setError(error.response?.data || "Failed to fetch cart items. Please try again.");
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);


  useEffect(() => {
    fetchTotalPrice();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
  {error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {error}
    </div>
  )}
  
  <NavbarCartPage />
  <div className="flex flex-row mt-5">
    <div className="flex-1 flex justify-center">
      <div className="w-[600px] flex flex-col space-y-4">
        {courses.length > 0 ? (
          courses.map(course => (
            <CartItem key={course.id} course={course} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            No courses in cart
          </div>
        )}
      </div>
    </div>
    
    <div className="flex justify-end">
      <CheckBox price={totalprice} />
    </div>
  </div>
</div>
  );
};

export default CartPage;