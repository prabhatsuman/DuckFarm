import React, { useState, useEffect, useCallback } from "react";
import _ from 'lodash';

const ExpenseFilterPanel = ({ onFilterChange, totalAmount }) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: null,
    endDate: null,
    expenseType: "",
    minAmount: "",
    maxAmount: "",
    selectedDealer: "",
  });

  const [expenseTypesList, setExpenseTypesList] = useState([]);
  const [dealersList, setDealersList] = useState([]);

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/expenses/expense_types/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setExpenseTypesList(data);
        } else {
          console.error("Failed to fetch expense types");
        }
      } catch (error) {
        console.error("Error fetching expense types:", error);
      }
    };

    const fetchDealers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/expenses/dealer_list/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDealersList(data);
        } else {
          console.error("Failed to fetch dealers");
        }
      } catch (error) {
        console.error("Error fetching dealers:", error);
      }
    };

    fetchExpenseTypes();
    fetchDealers();
  }, []);

  const debounceApplyFilters = useCallback(_.debounce((filters) => {
    onFilterChange(filters);
  }, 400), []);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      debounceApplyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const handleSearchChange = (e) => {
    handleFilterChange({ searchTerm: e.target.value });
  };

  const handleStartDateChange = (e) => {
    handleFilterChange({ startDate: e.target.value ? new Date(e.target.value) : null });
  };

  const handleEndDateChange = (e) => {
    handleFilterChange({ endDate: e.target.value ? new Date(e.target.value) : null });
  };

  const handleExpenseTypeChange = (e) => {
    handleFilterChange({ expenseType: e.target.value });
  };

  const handleMinAmountChange = (e) => {
    handleFilterChange({ minAmount: e.target.value });
  };

  const handleMaxAmountChange = (e) => {
    handleFilterChange({ maxAmount: e.target.value });
  };

  const handleDealerChange = (e) => {
    handleFilterChange({ selectedDealer: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      startDate: null,
      endDate: null,
      expenseType: "",
      minAmount: "",
      maxAmount: "",
      selectedDealer: "",
    });
    applyFilters({
      searchTerm: "",
      startDate: null,
      endDate: null,
      expenseType: "",
      minAmount: "",
      maxAmount: "",
      selectedDealer: "",
    });
  };
  const applyFilters = (filters) => {
    onFilterChange(filters);
  };
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium mb-2">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search expenses..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={filters.startDate ? filters.startDate.toISOString().substr(0, 10) : ''}
            onChange={handleStartDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={filters.endDate ? filters.endDate.toISOString().substr(0, 10) : ''}
            onChange={handleEndDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
        <select
          value={filters.expenseType}
          onChange={handleExpenseTypeChange}
          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Expense Type</option>
          {expenseTypesList.map((type, index) => (
            <option key={index} value={type.exp_type}>
              {type.exp_type}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
        <select
          value={filters.selectedDealer}
          onChange={handleDealerChange}
          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Dealer</option>
          {dealersList.map((dealer, index) => (
            <option key={index} value={dealer.name}>
              {dealer.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={filters.minAmount}
            onChange={handleMinAmountChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Min amount"
          />
          <input
            type="number"
            value={filters.maxAmount}
            onChange={handleMaxAmountChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Max amount"
          />
        </div>
      </div>
      <div className="mb-4">
        <p className="block text-sm font-medium text-gray-700 mb-1">Total Amount: &#8377;{totalAmount}</p>
      </div>
      <div>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilterPanel;
