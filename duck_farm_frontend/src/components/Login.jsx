import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Login = ({ toggleComponent }) => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  const authenticateUser = () => {
    const { email, password } = loginState;
   

    axios
      .post(`${API_URL}/api/login/`, {
        email: email,
        password: password,
      })
      .then((response) => {
        
        localStorage.setItem(`${API_URL}:username`, response.data.username);
        localStorage.setItem(`${API_URL}:accessToken`, response.data.access);
        localStorage.setItem(`${API_URL}:refreshToken`, response.data.refresh);
        console.log("Login successful:", response.data);
        navigate("/dashboard/home"); 
      })
      .catch((error) => {
        console.error("Login failed:", error);
        if (error.response && error.response.data) {
          alert("Incorrect Email Or Password"); 
        } else {
          alert("An unknown error occurred."); 
        }
      });
  };

  return (
    <div className="bg-opacity-60 rounded-lg bg-blue-950 py-8 px-4 shadow w-1/2">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={loginState.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={loginState.password}
              onChange={handleChange}
            />
          </div>
        </div>

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
