import axios from "axios";
import { useSnackbar } from "notistack";


export default function DeletePlanModal({isOpen, onClose, plan, onDelete}){
const BASE_URL = "http://localhost:5101";  
const {enqueueSnackbar} = useSnackbar();

const deletePlan = async () => {
    const token = localStorage.getItem("authToken");
    try{
        const response = await axios.delete(`${BASE_URL}/${plan.id || plan.Id}`, {

            headers: {Authorization: `Bearer ${token}`}
        })
        enqueueSnackbar("Plan Deleted", {variant: "success"})
        onClose();
         
        if(onDelete) onDelete();

        setTimeout(() => {
            window.location.reload();
          }, 1500);

    }
    catch(error){
        enqueueSnackbar("Error Deleting Plan", {variant: "error"})

    }
    

}
if (!isOpen) return null;


return( <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full border border-blue-500">
      <h2 className="text-white text-lg font-bold mb-4">
        Delete Confirmation
      </h2>
      <p className="text-gray-300 mb-6">
        Are you sure you want to delete the Plan &quot;{plan.title}&quot;?
        This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors`}
          onClick={() => {
            deletePlan();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>)

}