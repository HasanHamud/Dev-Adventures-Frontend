
import axios from "axios";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";


function CartItem({ course }) {
const { enqueueSnackbar } = useSnackbar();


  const RemoveItem = async (courseId) => {

    const token = localStorage.getItem('authToken'); 
    
    if (!token) {
      alert('Please login to add courses to cart');
     
      return;
    }
  try{
    console.log("Course ID to remove:", courseId);
    const response = await axios.delete(
      `http://localhost:5101/api/Cart/Course/${courseId}`,
      
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    enqueueSnackbar("Course Successfully Removed", { variant: "success" });
    setTimeout(()=>{
      window.location.reload(); 

    },1000);


}
catch(error){
  alert('Error Occured')
  enqueueSnackbar("Error Occured", { variant: "Error" });
}
}

  return (
    <div className=" border-2 border-blue-500 transition-colors  p-4 shadow bg-gray-800 text-white gap-3 flex flex-row mb-2 w-3/4 h-24 rounded-md justify-between items-center">
      <div> 
        <h3 className="font-bold">{course.title}</h3>
        <p className="font-bold">${course.price}</p>

      </div>
      <div>
<button className="text-white hover:text-red-500 text-2xl rounded-full w-9 h-9 text-center"
onClick={() => RemoveItem(course.id)}
>
  <h1>
   <FontAwesomeIcon icon={faCircleXmark} /> 
  </h1>
</button>  
  </div>
    </div>
  );
}

export default CartItem;