import React, { useState, useEffect } from "react";
import { getTodayDate } from "../utils/getTodayDate";
import eventBus from "../utils/eventBus";
import API_URL from "../config";
const AddSalesForm = ({ onClose, onSalesAdded }) => {
  const [formData, setFormData] = useState({
    date: "",
    quantity: "",
    price: "",
    dealer: "",
  });
  const [currentStock, setCurrentStock] = useState(0);
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  useEffect(() => {
    // Fetch current stock from the API
    const fetchCurrentStock = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/egg_stock/total_stock/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentStock(data.total_stock);
        } else {
          console.error("Failed to fetch current stock");
        }
      } catch (error) {
        console.error("Error fetching current stock:", error);
      }
    };

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

    fetchCurrentStock();
    fetchDealers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && parseInt(value) > currentStock) {
      setError("Quantity cannot exceed current stock");
      setIsNextDisabled(true);
    } else {
      setError("");
      setIsNextDisabled(false);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDealerChange = (e) => {
    const dealerId = parseInt(e.target.value);
    const selected = dealers.find((dealer) => dealer.id === dealerId);
    setSelectedDealer(selected);
    setFormData((prevState) => ({
      ...prevState,
      dealer: dealerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(formData.quantity) > currentStock) {
      setError("Quantity cannot exceed current stock");
      return;
    }

    if (isConfirming) {
      try {
        const response = await fetch(`${API_URL}/api/sales/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            ...formData,
            dealer: selectedDealer.id,
          }),
        });

        if (response.ok) {
          console.log("Sale added successfully");
          eventBus.dispatch("newSaleDataAdded", { newSaleDataAdded: true });
          eventBus.dispatch("newEarningDataAdded", { newEarningDataAdded: true });
          eventBus.dispatch("newEggDataAdded", { newEggDataAdded: true });
          onSalesAdded();
        } else {
          console.error("Failed to add sale");
        }
      } catch (error) {
        console.error("Error adding sale:", error);
      }
    } else {
      setIsConfirming(true);
    }
  };

  const handleEdit = () => {
    setIsConfirming(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {isConfirming ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Sale Details</h2>
            <p className="mb-4">Date: {formData.date}</p>
            <p className="mb-4">Quantity: {formData.quantity}</p>
            <p className="mb-4">Price Per Piece: {formData.price}</p>
            <p className="mb-4">Dealer: {selectedDealer.name}</p>
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
            <h2 className="text-xl font-bold mb-4">Add Sale</h2>
            <div className="mb-4">
              <label className="block text-gray-700">
                Current Egg Stock: {currentStock}
              </label>
            </div>
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
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price Per Piece</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Dealer</label>
              <select
                name="dealer"
                value={formData.dealer}
                onChange={handleDealerChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" disabled>
                  Select a dealer
                </option>
                {dealers.map((dealer) => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.name} ({dealer.dealer_type})
                  </option>
                ))}
              </select>
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
                className={`px-4 py-2 bg-blue-950 text-white rounded-md ${
                  isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isNextDisabled}
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

export default AddSalesForm;
