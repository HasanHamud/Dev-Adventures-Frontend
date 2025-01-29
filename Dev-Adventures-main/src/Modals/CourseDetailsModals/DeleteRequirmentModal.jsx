/* eslint-disable react/prop-types */
import { X } from "lucide-react";

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  requirementDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Confirm Deletion</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the requirement:
          <span className="font-medium text-white block mt-2">
            &quot;{requirementDescription}&quot;
          </span>
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
