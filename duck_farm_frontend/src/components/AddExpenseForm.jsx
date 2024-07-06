import React, { useState, useEffect } from "react";
import { getTodayDate } from "../utils/getTodayDate";
import eventBus from "../utils/eventBus";
import API_URL from "../config";


const AddExpenseForm = ({ onClose, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
  });

  const [dealerOption, setDealerOption] = useState("self");
  const [selectedDealer, setSelectedDealer] = useState(null); // New state for selected dealer
  const [dealers, setDealers] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    // Fetch dealers from the API
    const fetchDealers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dealer_info/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDealers(data);
        } else {
          console.error("Failed to fetch dealers");
        }
      } catch (error) {
        console.error("Error fetching dealers:", error);
      }
    };

    fetchDealers();
  }, []);

  const handleOptionChange = (e) => {
    setDealerOption(e.target.value);
    setSelectedDealer(null); // Reset selected dealer when option changes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDealerChange = (e) => {
    const dealerId = parseInt(e.target.value);
    const selected = dealers.find((dealer) => dealer.id === dealerId);
    setSelectedDealer(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsConfirming(true); // Show confirmation page
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          dealer: dealerOption === "self" ? null : selectedDealer?.id, // Use selectedDealer.id
          exp_type: "others", // Setting exp_type to 'others'
        }),
      });

      if (response.ok) {
        console.log("Expense added successfully");
        eventBus.dispatch("newExpenseDataAdded", { newExpenseDataAdded: true });
        eventBus.dispatch("newEarningDataAdded", { newEarningDataAdded: true });   
        onExpenseAdded();
           
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleEdit = () => {
    setIsConfirming(false); // Allow editing
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {isConfirming ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Expense</h2>
            <p className="mb-4">Date: {formData.date}</p>
            <p className="mb-4">Description: {formData.description}</p>
            <p className="mb-4">Amount: {formData.amount}</p>
            {dealerOption === "dealer" && (
              <p className="mb-4">Dealer: {selectedDealer ? selectedDealer.name : ""}</p>
            )}
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
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-950 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Add Other Expense</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                max={getTodayDate()}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter description"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Expense For</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="dealerOption"
                  value="self"
                  checked={dealerOption === "self"}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                <label className="mr-4">Self</label>
                <input
                  type="radio"
                  name="dealerOption"
                  value="dealer"
                  checked={dealerOption === "dealer"}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                <label>Select Dealer</label>
              </div>
            </div>
            {dealerOption === "dealer" && (
              <div className="mb-4">
                <label className="block text-gray-700">Select Dealer</label>
                <select
                  name="dealer"
                  value={selectedDealer ? selectedDealer.id : ""}
                  onChange={handleDealerChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="" disabled>
                    Select a dealer
                  </option>
                  {dealers.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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

export default AddExpenseForm;
