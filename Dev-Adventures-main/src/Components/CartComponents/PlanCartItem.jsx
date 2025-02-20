/* eslint-disable react/prop-types */
import { BookOpen } from "lucide-react";

const PlanCartItem = ({ plan, onRemove }) => {
  if (!plan) {
    return null;
  }

  const getLevelString = (level) => {
    switch (level) {
      case 0:
        return "Beginner";
      case 1:
        return "Intermediate";
      case 2:
        return "Advanced";
      default:
        return "Beginner";
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-700">
      {/* Plan Image */}
      <div className="w-24 h-24 bg-gray-700 flex-shrink-0">
        <div className="w-full h-full flex items-center justify-center bg-blue-900">
          <BookOpen className="w-12 h-12 text-blue-300" />
        </div>
      </div>

      {/* Plan Details */}
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-100">
            {plan.title || "Untitled Plan"}
          </h3>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-900 text-blue-300">
            {getLevelString(plan.level)}
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {plan.description || "No description available"}
        </p>

        <div className="flex gap-2 text-sm text-gray-400 mt-2">
          {plan.discount > 0 && (
            <>
              <span>•</span>
              <span className="text-green-500">
                {plan.discount}% discount applied
              </span>
            </>
          )}
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <span className="text-lg font-bold text-blue-500">
            ${plan.totalPrice?.toFixed(2) || "Free"}
          </span>
          {plan.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${plan.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={() => onRemove?.(plan.id)}
          className="text-blue-500 hover:text-blue-400"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default PlanCartItem;
