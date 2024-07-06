// FeedStockCard.js
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi"; // Import icons from react-icons library
import FeedUsePopup from "./FeedUsePopup"; // Import the FeedUsePopup component
import { useQuery, useQueryClient } from "react-query";
import eventBus from "../utils/eventBus";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlateWheat} from '@fortawesome/free-solid-svg-icons';
import API_URL from "../config";
const fetchTotalFeed = async () => {
  const response = await fetch(
    `${API_URL}/api/current_feed/total_stock/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.total_stock;
};

const FeedStockCard = () => {
  const [showFeedUsePopup, setShowFeedUsePopup] = useState(false); // State to toggle feed use popup visibility
  const [showOptions, setShowOptions] = useState(false); // State to toggle options visibility

  const queryClient = useQueryClient();
  const {
    data: totalFeed,
    error,
    isLoading,
    refetch,
  } = useQuery(["totalFeed"], fetchTotalFeed, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleUseFeed = () => {
    setShowFeedUsePopup(true);
    setShowOptions(false); // Close options when using feed
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
    const FeedHandler = () => {
      refetch();
    };
    eventBus.on("newFeedDataAdded", FeedHandler);
    return () => {
      eventBus.remove("newFeedDataAdded", FeedHandler);
    };
  }, [refetch]);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

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
              onClick={handleUseFeed}
            >
              <FiPlus className="inline-block mr-2" /> Use Feed
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-900">Feed Stock</h3>
          <p className="mt-2 text-black text-left">{totalFeed} Kg</p>
        </div>
        <div className="flex items-center">
            <FontAwesomeIcon
                icon={faPlateWheat}
                className="object-cover h-20 w-20 mr-3"
            />
        </div>
      </div>
      {showFeedUsePopup && (
        <FeedUsePopup
          onClose={() => setShowFeedUsePopup(false)}
          onFeedUsed={() => {
            queryClient.invalidateQueries(["totalFeed"]);
            setShowFeedUsePopup(false);
          }}
        />
      )}
    </div>
  );
};

export default FeedStockCard;
