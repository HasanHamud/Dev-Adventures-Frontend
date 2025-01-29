/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLocation } from "react-router";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import { DeleteModal } from "../../Modals/CourseDetailsModals/DeleteRequirmentModal";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const CourseSidebar = () => {
  const { state } = useLocation();
  const courseData = state?.courseData;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newRequirement, setNewRequirement] = useState("");
  const [editingRequirementId, setEditingRequirementId] = useState(null);
  const [editedRequirement, setEditedRequirement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    requirement: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
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
  }, []);

  const { data: requirements, error } = useSWR(
    courseData?.id
      ? `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`
      : null,
    fetcher
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const handleAddRequirement = async () => {
    if (newRequirement.trim()) {
      setIsLoading(true);
      try {
        await axios.post(
          `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`,
          { description: newRequirement.trim() },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await mutate(
          `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`
        );

        setNewRequirement("");
        setIsAdding(false);
        enqueueSnackbar("Requirement added successfully!", {
          variant: "success",
        });
      } catch (error) {
        console.error("Error adding requirement:", error);
        enqueueSnackbar(
          error.response?.data?.message || "Failed to add requirement",
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditRequirement = async (id, newDescription) => {
    setIsLoading(true);
    try {
      if (!newDescription || !newDescription.trim()) {
        enqueueSnackbar("Description is required", { variant: "error" });
        return;
      }

      const requestBody = newDescription.trim();

      await axios.put(
        `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements/${id}`,
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await mutate(
        `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`
      );

      setEditingRequirementId(null);
      setEditedRequirement("");
      enqueueSnackbar("Requirement updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error(
        "Error editing requirement:",
        error.response?.data || error
      );
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update requirement",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (requirement) => {
    setDeleteModal({
      isOpen: true,
      requirement: requirement,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.requirement) return;

    setIsLoading(true);
    try {
      await axios.delete(
        `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements/${deleteModal.requirement.id}`
      );

      await mutate(
        `http://localhost:5101/api/CourseDetails/${courseData.id}/requirements`
      );
      enqueueSnackbar("Requirement deleted successfully!", {
        variant: "success",
      });
      setDeleteModal({ isOpen: false, requirement: null });
    } catch (error) {
      console.error("Error deleting requirement:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete requirement",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div>Failed to load requirements.</div>;
  if (!requirements) return <div>Loading...</div>;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requirement: null })}
        onConfirm={handleDeleteConfirm}
        requirementDescription={deleteModal.requirement?.description}
      />

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-lg font-semibold mb-4">
          Course Details
        </h2>

        {/* Course details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Level</span>
            <span className="text-white">
              {courseData?.level || "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Created</span>
            <span className="text-white">
              {formatDate(courseData?.createdDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Updated</span>
            <span className="text-white">
              {formatDate(courseData?.updatedDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Students</span>
            <span className="text-white">
              {courseData?.students || "Not specified"}
            </span>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Requirements</h3>
            {isAdmin && (
              <button
                className="h-6 w-6 rounded-full flex items-center justify-center bg-gray-700 text-blue-500 hover:bg-gray-600"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {requirements.map((req) => (
              <li key={req.id} className="flex items-center justify-between">
                {editingRequirementId === req.id ? (
                  <input
                    type="text"
                    value={editedRequirement}
                    onChange={(e) => setEditedRequirement(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md"
                  />
                ) : (
                  <span className="text-gray-400">{req.description}</span>
                )}
                {isAdmin && (
                  <div className="flex space-x-2">
                    {editingRequirementId === req.id ? (
                      <button
                        onClick={() =>
                          handleEditRequirement(req.id, editedRequirement)
                        }
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingRequirementId(req.id);
                          setEditedRequirement(req.description);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(req)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isAdmin && isAdding && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Enter new requirement"
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddRequirement}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewRequirement("");
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enroll Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg">
          Enroll Now for ${courseData?.price || "99.99"}
        </button>
      </div>
    </>
  );
};
