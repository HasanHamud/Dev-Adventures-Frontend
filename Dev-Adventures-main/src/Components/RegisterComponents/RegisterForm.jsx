import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PasswordValidator } from "../../Validators/PasswordValidor/PasswordValidator";
import "react-toastify/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../../src/App.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [],
    checks: {},
    strength: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));

    if (id === "password") {
      const validationResult = PasswordValidator.validate(value);
      setPasswordValidation(validationResult);
    }
  };

  const handleNavigateToLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validationResult = PasswordValidator.validate(formData.password);
    if (!validationResult.isValid) {
      setErrorMessage("Please fix password validation errors");
      enqueueSnackbar("Password does not meet requirements", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const userData = {
      fullname: formData.fullname,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5101/api/register",
        userData
      );
      console.log("Registration successful:", response.data);
      enqueueSnackbar("Registration successful!", { variant: "success" });
      setIsLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const message = error.response?.data.message || "Registration failed.";
      setErrorMessage(message);
      enqueueSnackbar(message, { variant: "error" });
      setIsLoading(false);
    }
  };
 


  return (
    
    <form onSubmit={handleSubmit} className="w-80 bg-gray-800 p-6 rounded-lg relative">
      
      <h2 className="text-3xl font-semibold mb-4 text-white">Register</h2>
      <p className="text-[#e8f0ff] font-bold italic mb-2">Welcome To DeV.!</p>
      <p className="text-[#e8f0ff] text-xs mb-6">
        Please sign up to start your adventure!
      </p>

      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      {/* Full Name Input */}
      <div className="mb-4">
        <label className="block text-[#e8f0ff] text-sm mb-2" htmlFor="fullname">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          placeholder="Enter Full Name"
          className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-[#e8f0ff] text-sm mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-[#e8f0ff] text-sm mb-2" htmlFor="phone">
          Phone Number
        </label>
        <PhoneInput
          country={"lb"}
          value={formData.phone}
          onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
          inputClass="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          inputStyle={{
            width: "100%",
            height: "42px",
            backgroundColor: "#1f2937",
            border: "1px solid #4B5563",
            color: "#E5E7EB",
            borderRadius: "0.375rem",
          }}
          searchStyle={{
            backgroundColor: "#1f2937",
            color: "#E5E7EB",
            borderColor: "#4B5563",
          }}
          dropdownStyle={{
            backgroundColor: "#1f2937",
            color: "#E5E7EB",
            border: "1px solid #4B5563",
          }}
          containerClass="!bg-gray-700 rounded"
          buttonClass="!bg-gray-700 !border-gray-600"
          dropdownClass="!bg-gray-700 !text-gray-200"
          searchClass="!bg-gray-700 !text-gray-200"
          enableSearch={true}
          inputProps={{
            required: true,
            placeholder: "Enter phone number",
          }}
        />
      </div>

      {/* Password Input */}
      <div className="mb-4 relative">
        <label className="block text-[#e8f0ff] text-sm mb-2" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter password"
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <>
            <div className="mt-2">
              <div className="h-1 w-full bg-gray-700 rounded">
                <div
                  className={`h-full rounded transition-all duration-300 bg-${PasswordValidator.getStrengthColor(
                    passwordValidation.strength
                  )}`}
                  style={{ width: `${passwordValidation.strength}%` }}
                />
              </div>
              <p
                className={`text-sm mt-1 text-${PasswordValidator.getStrengthColor(
                  passwordValidation.strength
                )}`}
              >
                Strength:{" "}
                {PasswordValidator.getStrengthLevel(
                  passwordValidation.strength
                )}
              </p>
            </div>

            {/* Password Requirements */}
            <div className="mt-2 space-y-1">
              {Object.entries(passwordValidation.checks).map(
                ([check, passed]) => (
                  <div key={check} className="flex items-center text-xs gap-2">
                    <span
                      className={passed ? "text-green-500" : "text-red-500"}
                    >
                      {passed ? "✓" : "×"}
                    </span>
                    <span
                      className={passed ? "text-green-500" : "text-red-500"}
                    >
                      {check === "length"
                        ? "At least 8 characters"
                        : check === "uppercase"
                        ? "One uppercase letter"
                        : check === "lowercase"
                        ? "One lowercase letter"
                        : check === "number"
                        ? "One number"
                        : "One special character"}
                    </span>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="w-full p-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>

      {/* Sign In Link */}
      <div className="text-center mt-4">
        <span className="text-gray-400">Already have an account? </span>
        <Link
         
          onClick={handleNavigateToLogin}
          className="text-blue-500 hover:underline font-semibold"
        >
          Sign In
        </Link>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </form>
    
  );
};

export default RegisterForm;
