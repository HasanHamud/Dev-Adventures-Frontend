import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { enqueueSnackbar } from "notistack";
import { DeleteModal } from "../../Modals/CourseDetailsModals/DeleteObjectiveModal";

const API_BASE_URL = "http://localhost:5101/api/CourseDetails";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const CourseContent = () => {
  const { state } = useLocation();
  const courseData = state?.courseData;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [editingObjectiveId, setEditingObjectiveId] = useState(null);
  const [editedObjective, setEditedObjective] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    objective: null,
  });

  const { data: objectives, error } = useSWR(
    courseData?.id
      ? `${API_BASE_URL}/${courseData.id}/learning-objectives`
      : null,
    fetcher
  );

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

  const handleAddObjective = async () => {
    if (!newObjective.trim()) return;
    setIsLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/${courseData.id}/learning-objectives`,
        { description: newObjective.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      await mutate(`${API_BASE_URL}/${courseData.id}/learning-objectives`);
      setNewObjective("");
      setIsAdding(false);
      enqueueSnackbar("Learning objective added successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding objective:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to add learning objective",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditObjective = async (objectiveId, newDescription) => {
    if (!newDescription?.trim()) {
      enqueueSnackbar("Description is required", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = { description: newDescription.trim() };

      await axios.put(
        `${API_BASE_URL}/${courseData.id}/learning-objectives/${objectiveId}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      await mutate(`${API_BASE_URL}/${courseData.id}/learning-objectives`);
      setEditingObjectiveId(null);
      setEditedObjective("");
      enqueueSnackbar("Learning objective updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error editing objective:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update learning objective",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (objective) => {
    setDeleteModal({
      isOpen: true,
      objective: objective,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.objective) return;
    setIsLoading(true);

    try {
      await axios.delete(
        `${API_BASE_URL}/${courseData.id}/learning-objectives/${deleteModal.objective.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      await mutate(`${API_BASE_URL}/${courseData.id}/learning-objectives`);
      enqueueSnackbar("Learning objective deleted successfully!", {
        variant: "success",
      });
      setDeleteModal({ isOpen: false, objective: null });
    } catch (error) {
      console.error("Error deleting objective:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete learning objective",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error)
    return (
      <div className="text-red-500 p-4 text-center">
        Failed to load learning objectives. Please try refreshing the page.
      </div>
    );

  if (!objectives)
    return <div className="text-gray-400 p-4 text-center">Loading...</div>;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, objective: null })}
        onConfirm={handleDeleteConfirm}
        objectiveDescription={deleteModal.objective?.description}
      />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-4">
            About This Course
          </h2>
          <p className="text-gray-400 mb-8">
            {courseData?.description || "Course description not available"}
          </p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-semibold">
                What You&apos;ll Learn
              </h3>
              {isAdmin && (
                <button
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-700 text-blue-500 hover:bg-gray-600 transition-colors"
                  onClick={() => setIsAdding(true)}
                  aria-label="Add new objective"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>

            <ul className="space-y-3">
              {objectives.map((objective) => (
                <li
                  key={objective.id}
                  className="flex items-center justify-between text-gray-400 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-blue-500 flex-shrink-0">✓</span>
                    {editingObjectiveId === objective.id ? (
                      <input
                        type="text"
                        value={editedObjective}
                        onChange={(e) => setEditedObjective(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span>{objective.description}</span>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2 ml-4">
                      {editingObjectiveId === objective.id ? (
                        <>
                          <button
                            onClick={() =>
                              handleEditObjective(objective.id, editedObjective)
                            }
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingObjectiveId(null);
                              setEditedObjective("");
                            }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingObjectiveId(objective.id);
                              setEditedObjective(objective.description);
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="Edit objective"
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(objective)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete objective"
                          >
                            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {isAdmin && isAdding && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Enter new learning objective"
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddObjective}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewObjective("");
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {objectives.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No learning objectives available
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseContent;
