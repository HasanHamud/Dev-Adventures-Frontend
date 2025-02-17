import { PlanHeader } from "../../Components/PlansComponents/PlanHeader";
import { PlanCard } from "../../Components/PlansComponents/PlanCard";
import { useState, useEffect } from "react";
import AddPlanModal from "../../Modals/PlanModals/AddPlanModal";
import { EditPlanModal } from "../../Modals/PlanModals/EditPlanModal";
import axios from "axios";

function PlanPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:5101';
  const token = localStorage.getItem('authToken');

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Plan`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPlans(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [token]);

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async (updatedPlan) => {
    await fetchPlans(); // Refresh the plans list
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleAddSuccess = async (newPlan) => {
    await fetchPlans(); // Refresh the plans list
    setIsAddModalOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      Loading...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <PlanHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add New Plan
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(plans) && plans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              onEdit={() => handleEditPlan(plan)}
            />
          ))}
        </div>
      </div>

      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlan(null);
        }}
        onSuccess={handleEditSuccess}
        plan={selectedPlan}
      />
    </div>
  );
}

export default PlanPage;