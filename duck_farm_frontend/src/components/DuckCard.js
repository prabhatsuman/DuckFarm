import React, { useState, useEffect } from 'react';
import { FiInfo, FiPlus,FiChevronDown } from 'react-icons/fi'; // Import icons from react-icons library
import AddDuckForm from './AddDuckForm'; // Import the AddDuckForm component
import DuckInfoPopup from './DuckInfoPopup'; // Import the DuckInfoPopup component
import API_URL from '../config';

const DuckCard = ({ logoUrl }) => {
  // State variables
  const [totalDucks, setTotalDucks] = useState(0);
  const [showAddDuckForm, setShowAddDuckForm] = useState(false);
  const [showDuckInfoPopup, setShowDuckInfoPopup] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // State to toggle options visibility

  // Fetch total ducks on component mount
  useEffect(() => {
    fetchTotalDucks();
  }, []);

    const fetchTotalDucks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/duck_info/total/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

      if (response.ok) {
        const data = await response.json();
        setTotalDucks(data.total);
      } else {
        console.error("Failed to fetch total ducks");
      }
    } catch (error) {
      console.error("Error fetching total ducks:", error);
    }
  };

  // Toggle options menu visibility
  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Handle adding ducks
  const handleAddDucks = () => {
    setShowAddDuckForm(true);
    setShowOptions(false); // Close options when adding ducks
  };

  // Handle showing duck info popup
  const handleShowDuckInfo = () => {
    setShowDuckInfoPopup(true);
    setShowOptions(false); // Close options when showing duck info
  };

  // Handle closing duck info popup
  const handleCloseDuckInfo = () => {
    setShowDuckInfoPopup(false);
    fetchTotalDucks(); // Refresh the total ducks count when closing DuckInfoPopup
  };

  // Handle clicking outside options menu to close it
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".options-container") && !e.target.closest(".options-toggle")) {
      setShowOptions(false);
    }
  };

  // Attach event listener for clicking outside options menu
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // JSX rendering
  return (
    <div className="px-4 py-5 sm:p-6 relative">
      <div className="absolute top-4 right-1 z-20">
        <button
          className="text-gray-600 hover:text-gray-800 focus:outline-none options-toggle"
          onClick={handleToggleOptions}
        >
          <FiChevronDown className="text-xs" />
        </button>
        {showOptions && (
          <div className="absolute bg-white border border-gray-200 shadow-lg rounded-lg z-30 options-container" style={{ right: 20, top: 10 }}>
            <button
              className="block py-2.5 px-4 rounded hover:bg-gray-100 w-full text-left truncate"
              onClick={handleShowDuckInfo}
            >
              <FiInfo className="inline-block mr-2" /> Additional Info
            </button>
            <button
              className="block py-2.5 px-4 rounded hover:bg-gray-100 w-full text-left truncate"
              onClick={handleAddDucks}
            >
              <FiPlus className="inline-block mr-2" /> Add Ducks
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="Duck Logo"
            className="object-cover h-16 w-16 mr-3"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Total Ducks</h3>
          <p className="mt-2 text-sm text-gray-500 text-right">{totalDucks} ducks</p>
        </div>
      </div>
      {showAddDuckForm && (
        <AddDuckForm
          onClose={() => setShowAddDuckForm(false)}
          onDuckAdded={() => {
            setShowAddDuckForm(false);
            fetchTotalDucks(); // Refresh the total ducks count
          }}
        />
      )}
      {showDuckInfoPopup && <DuckInfoPopup onClose={handleCloseDuckInfo} />}
    </div>
  );
};

export default DuckCard;
