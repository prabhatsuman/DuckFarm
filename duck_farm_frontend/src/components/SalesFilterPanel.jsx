import React, { useState, useEffect,useCallback } from "react";
import _ from 'lodash';
import API_URL from "../config";

const SalesFilterPanel = ({ onFilterChange,totalAmount,totalQauntity }) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: null,
    endDate: null,
    minAmount: "",
    maxAmount: "",
    selectedDealer: "",
  });

  const [dealersList, setDealersList] = useState([]);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sales/dealer_list/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const dealers = data.map((dealer) => dealer.name);
          setDealersList(dealers);
        } else {
          console.error("Failed to fetch dealers");
        }
      } catch (error) {
        console.error("Error fetching dealers:", error);
      }
    };

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
      minAmount: "",
      maxAmount: "",
      selectedDealer: "",
    });
    applyFilters({
      searchTerm: "",
      startDate: null,
      endDate: null,
      minAmount: "",
      maxAmount: "",
      selectedDealer: "",
    });
  };

  const applyFilters = (filters) => {
    onFilterChange(filters);
  };

  return (
    <div className="bg-slate-300 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium mb-2">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-950 mb-1">
          Search
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search sales..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-950 mb-1">
          Date Range
        </label>
        <div className="flex-col space-y-2">
          <input
            type="date"
            value={filters.startDate ? filters.startDate.toISOString().substr(0, 10) : ""}
            onChange={handleStartDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={filters.endDate ? filters.endDate.toISOString().substr(0, 10) : ""}
            onChange={handleEndDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-950 mb-1">
          Dealer
        </label>
        <select
          value={filters.selectedDealer}
          onChange={handleDealerChange}
          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Dealer</option>
          {dealersList.map((dealer, index) => (
            <option key={index} value={dealer}>
              {dealer}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-950 mb-1">
          Amount Range
        </label>
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
        <p className="block text-sm font-medium text-gray-950 mb-1">Total Amount: &#8377;{totalAmount}</p>
      </div>
      <div className="mb-4">
        <p className="block text-sm font-medium text-gray-950 mb-1">Total Eggs Sold: {totalQauntity}</p>
      </div>
      <div>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SalesFilterPanel;
