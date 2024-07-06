import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const FeedUsePopup = ({ onClose,onFeedUsed }) => {
  const [feeds, setFeeds] = useState([]);
  const [feedUsage, setFeedUsage] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_URL}/api/current_feed/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeeds(response.data);
      setFeedUsage(
        response.data.map((feed) => ({
          id: feed.id,
          name: feed.name,
          quantity: feed.quantity,
          usage: 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  const handleInputChange = (id, event) => {
    const usage = parseInt(event.target.value);
    const updatedUsage = feedUsage.map((item) =>
      item.id === id ? { ...item, usage } : item
    );
    setFeedUsage(updatedUsage);

    const isDisabled = updatedUsage.some((item) => {
      const feed = feeds.find((feed) => feed.id === item.id);
      return feed && item.usage > feed.quantity;
    });
    setIsSubmitDisabled(isDisabled);
  };

  const renderWarning = (id) => {
    const feed = feeds.find((feed) => feed.id === id);
    const currentUsage =
      feedUsage.find((item) => item.id === id)?.usage || 0;
    if (feed && currentUsage > feed.quantity) {
      return (
        <span className="text-red-500">
          Input cannot be greater than available feed ({feed.quantity})
        </span>
      );
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const requests = feedUsage.map(async (item) => {
        const { id, usage } = item;
        if (usage > 0) {
          await axios.put(
            `${API_URL}/api/current_feed/${id}/`,
            { quantity: item.quantity - usage },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      });

      await Promise.all(requests);
      onFeedUsed();
    } catch (error) {
      console.error("Error updating feeds:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Use Feed</h2>
        <div className="overflow-y-auto max-h-96">
          {feeds.map((feed) => (
            <div key={feed.id} className="mb-4">
              <label className="block text-gray-700">
                {feed.name} (Available: {feed.quantity})
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  min="0"
                  defaultValue="0"
                  onChange={(event) => handleInputChange(feed.id, event)}
                  className="w-full px-4 py-2 border rounded-md mr-2"
                />
                {renderWarning(feed.id)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-4 py-2 bg-blue-950 text-white rounded-md ${
              isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedUsePopup;
