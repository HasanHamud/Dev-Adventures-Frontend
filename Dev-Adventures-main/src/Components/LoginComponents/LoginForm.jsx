import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import "react-toastify/ReactToastify.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const loginResponse = await axios.post(
        "http://localhost:5101/api/Login",
        {
          email,
          password,
        }
      );
      const profileResponse = await axios.get(
        `http://localhost:5101/api/profile/${loginResponse.data.id}`
      );

      localStorage.setItem("authToken", loginResponse.data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          email,
          id: loginResponse.data.id,
          name: profileResponse.data.fullname,
        })
      );

      enqueueSnackbar("Login successful!", { variant: "success" });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const message = error.response?.data.message || "Login failed.";
      setErrorMessage(message);
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Email and Password are required.");
      enqueueSnackbar("Please fill in both fields.", { variant: "warning" });
      return;
    }
    handleLogin(email, password);
  };

  const handleNavigateToSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/signup");
    }, 1000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-80 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4 text-white">Sign In</h2>
        <p className="text-[#e8f0ff] font-bold italic mb-2">Welcome To DeV.!</p>
        <p className="text-[#e8f0ff] text-xs mb-6">
          Please sign in to start your adventure!
        </p>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <div className="mb-4">
          <label className="block text-[#e8f0ff] text-sm mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-[#e8f0ff] text-sm mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter password"
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <div
            className="absolute right-2 bottom-3 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </div>
        </div>

        <div className="text-right mb-4">
          <a href="#" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full p-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-center mt-4">
          <span className="text-[#e8f0ff]">New on our platform? </span>
          <Link
            onClick={handleNavigateToSignup}
            className="text-blue-500 hover:underline font-semibold"
          >
            Create new account.
          </Link>
        </div>
      </form>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
