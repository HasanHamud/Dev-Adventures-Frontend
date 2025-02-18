/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import axios from "axios";

const LearningOutcomesComponent = ({
  lessonId,
  initialOutcomes = [],
  onUpdate,
}) => {
  const [outcomes, setOutcomes] = useState(initialOutcomes);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newOutcome, setNewOutcome] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchOutcomes = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `http://localhost:5101/api/learningoutcomes/lesson/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOutcomes(response.data);
      } catch (error) {
        console.error("Failed to fetch learning outcomes:", error);
      }
    };

    fetchOutcomes();
  }, [lessonId, onUpdate]);

  const handleAddOutcome = async () => {
    if (!newOutcome.trim()) return;

    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `http://localhost:5101/api/learningoutcomes`,
        { lessonId, description: newOutcome },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOutcomes([...outcomes, response.data]);
      setNewOutcome("");
      setIsAdding(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to add learning outcome:", error);
    }
  };

  const handleUpdateOutcome = async (id, index) => {
    if (!editValue.trim()) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `http://localhost:5101/api/learningoutcomes/${id}`,
        { id, lessonId, description: editValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedOutcomes = [...outcomes];
      updatedOutcomes[index] = {
        ...updatedOutcomes[index],
        description: editValue,
      };
      setOutcomes(updatedOutcomes);
      setEditingIndex(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to update learning outcome:", error);
    }
  };

  const handleDeleteOutcome = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`http://localhost:5101/api/learningoutcomes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setOutcomes(outcomes.filter((outcome) => outcome.id !== id));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to delete learning outcome:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <span>Learning Outcomes</span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Outcome
        </button>
      </div>

      <div className="space-y-2">
        {outcomes.map((outcome, idx) => (
          <div key={outcome.id || idx} className="group flex items-start gap-2">
            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500/50" />
            {editingIndex === idx ? (
              <div className="flex flex-grow items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-grow rounded-md border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white"
                />
                <button
                  onClick={() => handleUpdateOutcome(outcome.id, idx)}
                  className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="rounded-md bg-gray-600 p-1 text-white hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-grow items-start justify-between text-sm text-gray-400">
                <span>{outcome.description}</span>
                <div className="ml-2 hidden gap-2 group-hover:flex">
                  <button
                    onClick={() => {
                      setEditingIndex(idx);
                      setEditValue(outcome.description);
                    }}
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteOutcome(outcome.id)}
                    className="rounded-md p-1 text-red-500 hover:bg-gray-700 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2">
            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500/50" />
            <div className="flex flex-grow items-center gap-2">
              <input
                type="text"
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                placeholder="Enter new learning outcome..."
                className="flex-grow rounded-md border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white"
              />
              <button
                onClick={handleAddOutcome}
                className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewOutcome("");
                }}
                className="rounded-md bg-gray-600 p-1 text-white hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningOutcomesComponent;
