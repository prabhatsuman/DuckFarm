import React, { useState, useEffect } from "react";

const AddExpenseForm = ({ onClose, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    dealer: null,
  });

  const [dealerOption, setDealerOption] = useState("self");
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    // Fetch dealers from the API
    const fetchDealers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dealer_info/", {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/expenses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          dealer: dealerOption === "self" ? null : formData.dealer,
          exp_type: "others", // Setting exp_type to 'others'
        }),
      });

      if (response.ok) {
        onExpenseAdded();
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Other Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
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
                value={formData.dealer || ""}
                onChange={handleChange}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
