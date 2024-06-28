import React, { useState, useEffect } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi"; // Import icons from react-icons library
import FeedUsePopup from "./FeedUsePopup"; // Import the FeedUsePopup component

const FeedStockCard = ({ logoUrl }) => {
  const [totalFeed, setTotalFeed] = useState(0);
  const [showFeedUsePopup, setShowFeedUsePopup] = useState(false); // State to toggle feed use popup visibility
  const [showOptions, setShowOptions] = useState(false); // State to toggle options visibility

  useEffect(() => {
    fetchTotalFeed();
  }, []);

  const fetchTotalFeed = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/current_feed/total_stock/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTotalFeed(data.total_stock);
      } else {
        console.error("Failed to fetch total feed");
      }
    } catch (error) {
      console.error("Error fetching total feed:", error);
    }
  };

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
              onClick={handleUseFeed}
            >
              <FiPlus className="inline-block mr-2" /> Use Feed
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="Feed Logo"
            className="object-cover h-16 w-16 mr-3"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Feed Stock</h3>
          <p className="mt-2 text-sm text-gray-500 text-right">
            {totalFeed} Kg
          </p>
        </div>
      </div>
      {showFeedUsePopup && (
        <FeedUsePopup
          onClose={() => setShowFeedUsePopup(false)}
          onFeedUsed={() => {
            fetchTotalFeed();
            setShowFeedUsePopup(false);
          }}
        />
      )}
    </div>
  );
};

export default FeedStockCard;
