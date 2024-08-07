import React, { useState, useEffect, useCallback } from "react";
import { getTodayDate } from "../utils/getTodayDate";
import eventBus from "../utils/eventBus";
import API_URL from "../config";

const AddEggForm = ({ onClose, onEggAdded }) => {
  const [formData, setFormData] = useState({
    date: "",
    quantity: "",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [existingEntry, setExistingEntry] = useState(false);

  const checkExistingEntry = useCallback(async () => {
    if (formData.date) {
      try {
        const response = await fetch(
          `${API_URL}/api/egg_stock/by_date/?date=${formData.date}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
            },
          }
        );
        const data = await response.json();
        setExistingEntry(data.length > 0);
      } catch (error) {
        console.error("Error checking existing entry:", error);
      }
    }
  }, [formData.date]);

  useEffect(() => {
    checkExistingEntry();
  }, [formData.date, checkExistingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isConfirming) {
      try {
        const response = await fetch(`${API_URL}/api/egg_stock/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          console.log("Eggs added successfully");
          eventBus.dispatch("newEggDataAdded", { newEggDataAdded: true });   

          onEggAdded();
        } else {
          console.error("Failed to add eggs");
        }
      } catch (error) {
        console.error("Error adding eggs:", error);
      }
    } else {
      setIsConfirming(true);
    }
  };

  const handleEdit = () => {
    setIsConfirming(false);
  };

  const handleChooseAnotherDate = () => {
    setFormData((prevState) => ({
      ...prevState,
      date: "",
    }));
    setExistingEntry(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {isConfirming ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Egg Collection</h2>
            <p className="mb-4">Date: {formData.date}</p>
            <p className="mb-4">Egg Count: {formData.quantity}</p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-950 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Add Egg Collection</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
                disabled={existingEntry}
                max={getTodayDate()}
              />
              {existingEntry && (
                <div className="mt-2">
                  <p className="text-red-500 text-sm">
                    Egg collection for this date already exists.
                  </p>
                  <button
                    type="button"
                    onClick={handleChooseAnotherDate}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Choose Another Date
                  </button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Egg Count</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-950 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEggForm;
