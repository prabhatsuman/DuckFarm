import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiPlus } from 'react-icons/fi'; // Import icons from react-icons library
import AddEggForm from './AddEggForm'; // Import the AddEggForm component
import API_URL from '../config';

const EggCard = ({ logoUrl }) => {
  const [totalEggs, setTotalEggs] = useState(0);
  const [showAddEggForm, setShowAddEggForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // State to toggle options visibility

  useEffect(() => {
    fetchTotalEggs();
  }, []);

    const fetchTotalEggs = async () => {
        try {
            const response = await fetch(`${API_URL}/api/egg_stock/total_stock/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

      if (response.ok) {
        const data = await response.json();
        setTotalEggs(data.total_stock);
      } else {
        console.error('Failed to fetch total eggs');
      }
    } catch (error) {
      console.error('Error fetching total eggs:', error);
    }
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleAddEggs = () => {
    setShowAddEggForm(true);
    setShowOptions(false); // Close options when adding eggs
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".options-container") && !e.target.closest(".options-toggle")) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
          <div
            className="absolute bg-white border border-gray-200 shadow-lg rounded-lg z-30 options-container"
            style={{ right: 20, top: 10 }}
          >
            <button
              className="block py-2.5 px-4 rounded hover:bg-gray-100 w-full text-left truncate"
              onClick={handleAddEggs}
            >
              <FiPlus className="inline-block mr-2" /> Add Eggs
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={logoUrl} alt="Egg Logo" className="object-cover h-16 w-16 mr-3" />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Egg Stock</h3>
          <p className="mt-2 text-sm text-gray-500 text-right">{totalEggs} eggs</p>
        </div>
      </div>
      {showAddEggForm && (
        <AddEggForm
          onClose={() => setShowAddEggForm(false)}
          onEggAdded={() => {
            setShowAddEggForm(false);
            fetchTotalEggs(); // Refresh the total eggs count
          }}
        />
      )}
    </div>
  );
};

export default EggCard;
