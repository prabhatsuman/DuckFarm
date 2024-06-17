import React, { useState, useEffect } from "react";

const ExpenseFilterPanel = ({ expenses, filteredExpenses, setFilteredExpenses, fetchExpenses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expenseType, setExpenseType] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [expenseTypesList, setExpenseTypesList] = useState([]);

  useEffect(() => {
    // Fetch expense types from expenses data and update the list
    const types = expenses.reduce((acc, expense) => {
      if (expense.exp_type && !acc.includes(expense.exp_type.toLowerCase())) {
        acc.push(expense.exp_type.toLowerCase());
      }
      return acc;
    }, []);
    setExpenseTypesList(types);
  }, [expenses]);

  useEffect(() => {
    filterExpenses();
  }, [searchTerm, startDate, endDate, expenseType, minAmount, maxAmount]);

  const filterExpenses = () => {
    let filteredData = expenses.filter((expense) => {
      // Filter by search term
      const matchesSearchTerm = expense.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by date range
      const expenseDate = new Date(expense.date);
      const isWithinDateRange = (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);

      // Filter by expense type
      const matchesExpenseType = !expenseType || expense.exp_type.toLowerCase() === expenseType.toLowerCase();

      // Filter by amount range
      const expenseAmount = parseFloat(expense.amount);
      const isWithinAmountRange = (!minAmount || expenseAmount >= parseFloat(minAmount)) &&
                                  (!maxAmount || expenseAmount <= parseFloat(maxAmount));

      return matchesSearchTerm && isWithinDateRange && matchesExpenseType && isWithinAmountRange;
    });

    setFilteredExpenses(filteredData);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value ? new Date(e.target.value) : null);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value ? new Date(e.target.value) : null);
  };

  const handleExpenseTypeChange = (e) => {
    setExpenseType(e.target.value);
  };

  const handleMinAmountChange = (e) => {
    setMinAmount(e.target.value);
  };

  const handleMaxAmountChange = (e) => {
    setMaxAmount(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setExpenseType("");
    setMinAmount("");
    setMaxAmount("");
    fetchExpenses(); // Reload all expenses
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium mb-2">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          value={searchTerm}
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
            value={startDate ? startDate.toISOString().substr(0, 10) : ''}
            onChange={handleStartDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={endDate ? endDate.toISOString().substr(0, 10) : ''}
            onChange={handleEndDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
        <select
          value={expenseType}
          onChange={handleExpenseTypeChange}
          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Expense Type</option>
          {expenseTypesList.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={minAmount}
            onChange={handleMinAmountChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Min amount"
          />
          <input
            type="number"
            value={maxAmount}
            onChange={handleMaxAmountChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Max amount"
          />
        </div>
      </div>
      <div className="mb-4">
        <p className="block text-sm font-medium text-gray-700 mb-1">Total Amount: &#8377;{getTotalAmount()}</p>
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
