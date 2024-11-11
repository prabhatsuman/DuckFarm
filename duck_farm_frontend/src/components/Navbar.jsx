import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiUser, FiLogOut } from "react-icons/fi";
import API_URL from "../config";
import { useQueryClient } from "react-query";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fetch username from session or localStorage
    const storedUsername = localStorage.getItem(`${API_URL}:username`);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    //black list the token
    axios.post(`${API_URL}/api/token/blacklist/`, {
      refresh: localStorage.getItem(`${API_URL}:refreshToken`),
    });
    localStorage.removeItem(`${API_URL}:accessToken`);
    localStorage.removeItem(`${API_URL}:username`);
    localStorage.removeItem(`${API_URL}:refreshToken`);
    queryClient.clear();

    navigate("/");
  };

  const handleRedirect = () => {
    navigate("/dashboard/home");
  };

  return (
    <nav className=" inset-x-0 sticky top-0 z-50 px-4 py-3 flex justify-between items-center md:justify-end">     
     
      <div className="flex space-x-2 md:space-x-4">
        {/* Home Button */}
        <button
          className="flex items-center text-black text-lg hover:text-gray-600 hover:bg-gray-200 transition-colors duration-300 rounded-full p-2"
          onClick={handleRedirect}
        >
          {username && (
            <span className="flex items-center mr-2  font-bold text-xl">
              <FiUser className="w-5 h-5 mr-1" />

              {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>
          )}
        </button>

        {/* Logout Button */}
        <button
          className="flex items-center text-black font-bold text-xl hover:text-gray-600 hover:bg-gray-200 transition-colors duration-300 rounded-full p-2"
          onClick={handleLogout}
        >
          <FiLogOut className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
