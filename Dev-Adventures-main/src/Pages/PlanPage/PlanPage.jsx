/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { PlanHeader } from "../../Components/PlansComponents/PlanHeader";
import { PlanCard } from "../../Components/PlansComponents/PlanCard";
import AddPlanModal from "../../Modals/PlanModals/AddPlanModal";
import { EditPlanModal } from "../../Modals/PlanModals/EditPlanModal";
import Navbar from "../../Components/Navigators/Navbar";

function PlanPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const BASE_URL = "http://localhost:5101";
  const token = localStorage.getItem("authToken");

  // Function to check if the user is an admin
  const checkIfAdmin = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roles =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        const userIsAdmin = Array.isArray(roles)
          ? roles.includes("Admin")
          : roles === "Admin";
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    checkIfAdmin();
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPlans(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async (updatedPlan) => {
    await fetchPlans();
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleAddSuccess = async (newPlan) => {
    await fetchPlans(); // Refresh the plans list
    setIsAddModalOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <Navbar />
      <PlanHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-end">
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Add New Plan
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(plans) &&
            plans.map((plan) => (
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
