import { useState, useCallback, useEffect } from 'react';
import { ChevronRight, CheckCircle, BookOpen, Edit2, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditPlanModal } from '../../Modals/PlanModals/EditPlanModal';
import DeletePlanModal from '../../Modals/PlanModals/DeletePlanModal';
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
export function PlanCard({ plan, onPlanUpdate, onPlanDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    // Check if the user has an admin role
    const checkIfAdmin = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          const userIsAdmin = Array.isArray(roles) ? roles.includes("Admin") : roles === "Admin";
          setIsAdmin(userIsAdmin);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    checkIfAdmin();
  }, []);

  if (!plan) {
    return <div>Loading...</div>;
  }

  const getLevelStyle = (level) => {
    switch(level) {
      case 0:
        return 'bg-blue-900 text-blue-300';
      case 1:
        return 'bg-purple-900 text-purple-300';
      case 2:
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-blue-900 text-blue-300';
    }
  };

  const getLevelString = (level) => {
    switch(level) {
      case 0:
        return 'Beginner';
      case 1:
        return 'Intermediate';
      case 2:
        return 'Advanced';
      default:
        return 'Beginner';
    }
  };

  const handleEditSuccess = (updatedPlan) => {
    if (onPlanUpdate) {
      onPlanUpdate(updatedPlan);
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteSuccess = (deletedPlan) => {
    if (onPlanDelete) {
      onPlanDelete(deletedPlan);
    }
    setIsDeleteModalOpen(false);
  };

  const handleAddToCart = useCallback(async () => {
    try {
      setIsAddingToCart(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to add to cart');
        enqueueSnackbar('Please log in to add to cart', { variant: 'error' });
        return;
      }

      const response = await fetch(`http://localhost:5101/api/Cart/Plan/${plan.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add plan to cart');
      }

      enqueueSnackbar('Plan added to cart successfully!', { variant: 'success' });
      window.location.reload(); 
    } catch (err) {
      setError(err.message || 'Failed to add plan to cart');
      enqueueSnackbar(err.message || 'Failed to add plan to cart', { variant: 'error' });
      console.error('Add to cart error:', err);
    } finally {
      setIsAddingToCart(false);
    }
  }, [plan.id, enqueueSnackbar]);

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors flex flex-col">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className={`${getLevelStyle(plan.level)} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
              {getLevelString(plan.level)}
            </div>
            {/* Conditionally render Edit and Delete buttons based on isAdmin */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 rounded-full transition-colors"
                  title="Edit Plan"
                >
                  <Edit2 className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                </button>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1 rounded-full transition-colors"
                  title="Delete Plan"
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <h3 className="text-lg font-bold text-white mb-2">{plan.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
          
          {/* Courses List */}
          <div className="space-y-3">
            {plan.courses?.map((course) => (
              <div 
                key={course.id} 
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  {course.title}
                </div>
              </div>
            ))}
          </div>

          {/* Price and Details */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-white">
                ${(plan.totalPrice || 0).toFixed(2)}
              </span>
              {plan.discount > 0 && (
                <span className="text-green-500 text-sm ml-2">
                  ({plan.discount}% off)
                </span>
              )}
            </div>

            {error && (
              <div className="text-red-400 text-sm mt-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto border-t border-gray-700 bg-gray-700">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full px-5 py-3 text-blue-400 text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        plan={plan}
      />

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        plan={plan}
      />
    </>
  );
}
