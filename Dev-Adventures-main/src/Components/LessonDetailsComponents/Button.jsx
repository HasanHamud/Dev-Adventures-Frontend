/* eslint-disable react/prop-types */

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "bg-transparent border border-gray-700 text-white hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-700",
  };
  const sizeStyles = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm",
    icon: "p-1",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};
