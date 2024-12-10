import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const Login = ({ toggleComponent }) => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const authenticateUser = () => {
    const { email, password } = loginState;

    axios
      .post(`${API_URL}/api/login/`, {
        email: email,
        password: password,
      })
      .then((response) => {
        const { access, refresh, user } = response.data;

        // Store tokens and user info in localStorage
        localStorage.setItem(`${API_URL}:accessToken`, access);
        localStorage.setItem(`${API_URL}:refreshToken`, refresh);
        localStorage.setItem(`${API_URL}:username`, user.first_name);
        localStorage.setItem(`${API_URL}:farmName`, user.farm_name);

        console.log("Login successful:", response.data);
        navigate("/dashboard/home"); // Redirect to dashboard
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { email, password } = error.response.data;

          // Set field-specific errors
          setErrors({
            email: email || "",
            password: password || "",
          });
        } else {
          alert("An unknown error occurred."); // Handle unknown errors
        }
      });
  };

  return (
    <div className="bg-opacity-60 rounded-lg bg-blue-950 py-8 px-4 shadow w-1/2">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Enter your email"
              value={loginState.email}
              onChange={handleChange}
            />
           
          </div>
          {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
        </div>

        {/* Password Input */}
        <div>
          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Enter your password"
              value={loginState.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
        
          </div>
          {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-7">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={toggleComponent}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create an account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
