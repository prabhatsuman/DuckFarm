import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import AddEggForm from "./AddEggForm";
import eventBus from "../utils/eventBus";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEgg} from '@fortawesome/free-solid-svg-icons';
import API_URL from "../config";

const fetchTotalEggs = async () => {
  
  const response = await fetch(
    `${API_URL}/api/egg_stock/total_stock/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const EggCard = () => {
  const [showAddEggForm, setShowAddEggForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: totalStockData,
    error,
    isLoading,
    refetch,
  } = useQuery(["totalEggs"], fetchTotalEggs, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleAddEggs = () => {
    setShowAddEggForm(true);
    setShowOptions(false);
  };

  const handleOutsideClick = (e) => {
    if (
      !e.target.closest(".options-container") &&
      !e.target.closest(".options-toggle")
    ) {
      setShowOptions(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const addEggHandler = () => {
      refetch();
    };
    eventBus.on("newEggDataAdded", addEggHandler);
    return () => {
      eventBus.remove("newEggDataAdded", addEggHandler);
    };
  }, [refetch]);

   

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

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
        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-900">Egg Stock</h3>
          <p className="mt-2 text-black text-left">
            {totalStockData.total_stock} eggs
          </p>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faEgg} size="5x" className=" text-slate-600" />
        </div>
      </div>
      {showAddEggForm && (
        <AddEggForm
          onClose={() => setShowAddEggForm(false)}
          onEggAdded={() => {
            setShowAddEggForm(false);
            queryClient.invalidateQueries(["totalEggs"]);
          }}
        />
      )}
    </div>
  );
};

export default EggCard;
