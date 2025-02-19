
// eslint-disable-next-line react/prop-types
export const Progress = ({ value, className = "" }) => {
  return (
    <div className={`h-1 w-full bg-gray-700/50 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full transition-all"
        style={{
          width: `${value}%`,
          backgroundColor: value >= 70 ? "#22c55e" : "#ef4444",
        }}
      />
    </div>
  );
};
