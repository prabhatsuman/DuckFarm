import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch username from session or localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear access token and username from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="bg-gray-50 border-b border-gray-300 inset-x-0 sticky top-0 z-50 px-4 py-3 flex justify-between items-center md:justify-end">
      {/* Hamburger Button */}
      <button
        className="md:hidden p-4 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FiMenu className="w-6 h-6 text-gray-800 hover:text-gray-600 transition-colors duration-300" />
      </button>

      <div className="flex space-x-2 md:space-x-4">
        {/* Home Button */}
        <button
          className="flex items-center text-black text-lg hover:text-gray-600 hover:bg-gray-200 transition-colors duration-300 rounded-full p-2"
          onClick={handleRedirect}
        >
          {username && (
            <span className="flex items-center mr-2">
              <FiUser className="w-5 h-5 mr-1" />
             
            {username.charAt(0).toUpperCase() + username.slice(1)}
              
            </span>
          )}
          
        </button>

        {/* Logout Button */}
        <button
          className="flex items-center text-black text-lg hover:text-gray-600 hover:bg-gray-200 transition-colors duration-300 rounded-full p-2"
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
