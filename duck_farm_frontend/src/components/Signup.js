import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({toggleComponent}) => {
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSignupState({ ...signupState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signupState.password !== signupState.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    registerUser();
  };

  const registerUser = () => {
    const { firstName, lastName, username, email, password } = signupState;

    axios
      .post("http://127.0.0.1:8000/api/register/", {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Signup successful:", response.data);
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Signup failed:", error);
      });
  };

  return (
    <div className="w-1/2 max-w-md">
      <div className="bg-opacity-60 rounded-lg bg-blue-950 py-8 px-4 shadow">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your first name"
                value={signupState.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your last name"
                value={signupState.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your username"
              value={signupState.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={signupState.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={signupState.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm your password"
              value={signupState.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-7">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={toggleComponent}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
        
        </form>
      </div>
    </div>
  );
};

export default Signup;
