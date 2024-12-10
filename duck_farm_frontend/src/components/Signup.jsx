import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Signup = ({ toggleComponent }) => {
  const [signupState, setSignupState] = useState({
    firstName: "",
    lastName: "",
    farmname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setSignupState({ ...signupState, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null }); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, farmname, email, password, confirmPassword } = signupState;

    // Send the data to the backend
    axios
      .post(`${API_URL}/api/register/`, {
        first_name: firstName,
        last_name: lastName,
        farm_name: farmname,
        email,
        password,
        confirm_password: confirmPassword,
      })
      .then((response) => {
        console.log("Signup successful:", response.data);
        setSuccess(true);
        setFieldErrors({});
        toggleComponent(); // Navigate or change component
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        if (error.response && error.response.data) {
          setFieldErrors(error.response.data); // Map backend errors directly to state
        }
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
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                placeholder="Enter your first name"
                value={signupState.firstName}
                onChange={handleChange}
              />
              {fieldErrors.first_name && (
                <div className="text-red-500 text-sm mt-1">{fieldErrors.first_name[0]}</div>
              )}
            </div>
            <div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                placeholder="Enter your last name"
                value={signupState.lastName}
                onChange={handleChange}
              />
              {fieldErrors.last_name && (
                <div className="text-red-500 text-sm mt-1">{fieldErrors.last_name[0]}</div>
              )}
            </div>
          </div>
          <div>
            <input
              id="farmname"
              name="farmname"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
              placeholder="Enter your farm name"
              value={signupState.farmname}
              onChange={handleChange}
            />
            {fieldErrors.farm_name && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.farm_name[0]}</div>
            )}
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
              placeholder="Enter your email"
              value={signupState.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.email[0]}</div>
            )}
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
              placeholder="Enter your password"
              value={signupState.password}
              onChange={handleChange}
            />
            {fieldErrors.password &&
              fieldErrors.password.map((error, index) => (
                <div key={index} className="text-red-500 text-sm mt-1">
                  {error}
                </div>
              ))}
          </div>
          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
              placeholder="Confirm your password"
              value={signupState.confirmPassword}
              onChange={handleChange}
            />
            {fieldErrors.confirm_password && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.confirm_password[0]}</div>
            )}
          </div>
          {success && (
            <div className="text-green-500 text-sm mt-2">
              Signup successful! Please log in.
            </div>
          )}
          <div className="flex flex-col gap-7">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={toggleComponent}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-900"
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
