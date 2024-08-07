import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiPlus } from "react-icons/fi";
import ExpenseFilterPanel from "./ExpenseFilterPanel";
import AddExpenseModal from "./AddExpenseForm";
import API_URL from "../config";

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [expensesPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, [
    currentPage,
    startDate,
    endDate,
    searchTerm,
    minAmount,
    maxAmount,
    selectedDealer,
    expenseType,
  ]);

  const fetchExpenses = async () => {
    try {
      const apiUrl = `${API_URL}/api/expenses/`;

      const queryParams = {
        page: currentPage,
        page_size: expensesPerPage,
      };

      if (searchTerm.trim() !== "") {
        queryParams.searchTerm = searchTerm.trim();
      }

      if (startDate instanceof Date && !isNaN(startDate)) {
        queryParams.startDate = startDate.toISOString().substr(0, 10);
      }

      if (endDate instanceof Date && !isNaN(endDate)) {
        queryParams.endDate = endDate.toISOString().substr(0, 10);
      }

      if (minAmount !== "" && !isNaN(parseFloat(minAmount))) {
        queryParams.minAmount = parseFloat(minAmount);
      }

      if (maxAmount !== "" && !isNaN(parseFloat(maxAmount))) {
        queryParams.maxAmount = parseFloat(maxAmount);
      }

      if (selectedDealer.trim() !== "") {
        queryParams.selectedDealer = selectedDealer.trim();
      }

      if (expenseType.trim() !== "") {
        queryParams.expenseType = expenseType.trim();
      }

      const url = new URL(apiUrl);
      url.search = new URLSearchParams(queryParams).toString();

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.results);
        setFilteredExpenses(data.results);
        setTotalPages(data.total_pages);
        setTotalAmount(data.total_amount);
      } else {
        console.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setSearchTerm(newFilters.searchTerm);
    setStartDate(newFilters.startDate);
    setEndDate(newFilters.endDate);
    setMinAmount(newFilters.minAmount);
    setMaxAmount(newFilters.maxAmount);
    setSelectedDealer(newFilters.selectedDealer);
    setExpenseType(newFilters.expenseType);
    setCurrentPage(1);
  };

  const sortExpenses = (data) => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      if (sortColumn === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortColumn === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }

    const sortedExpenses = sortExpenses(filteredExpenses);
    setFilteredExpenses(sortedExpenses);
  };

  const handleDownloadExcel = () => {
    const totalAmount = filteredExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );

    const data = [
      ["Date", "Description", "Dealer Name", "Dealer Type", "Amount"],
      ...filteredExpenses.map((expense) => [
        expense.date,
        expense.description,
        expense.dealer ? expense.dealer.name : "No dealer assigned",
        expense.dealer ? expense.dealer.dealer_type : "N/A",
        parseFloat(expense.amount),
      ]),
      ["", "", "", "Total:", totalAmount.toFixed(2)],
    ];

    const currentDate = new Date()
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/[/:]/g, "-");

    const fileName = `expenses-${currentDate}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, fileName);
  };

  const toggleAddExpenseModal = () => {
    setIsAddExpenseModalOpen(!isAddExpenseModalOpen);
  };

  const handleExpenseAdded = () => {
    fetchExpenses();
    toggleAddExpenseModal();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-row m-auto w-full max-h-screen">
      <div className="flex flex-col w-3/4 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center bg-blue-300 text-black px-4 py-2 rounded-md"
            >
              <FiDownload className="mr-2" /> Download Excel
            </button>
            <button
              onClick={toggleAddExpenseModal}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              <FiPlus className="mr-2" /> Add Expense
            </button>
          </div>
        </div>
        <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-250px)]">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-br from-blue-950 to-slate-950 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortColumn === "date" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal"
                >
                  Dealer
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortColumn === "amount" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 divide-y divide-gray-400">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4">{expense.date}</td>
                  <td className="px-6 py-4 break-words w-64">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    {expense.dealer ? (
                      <div>
                        <div>{expense.dealer.name}</div>
                        <div className="text-xs text-gray-500">
                          {expense.dealer.dealer_type}
                        </div>
                      </div>
                    ) : (
                      "No dealer assigned"
                    )}
                  </td>
                  <td className="px-6 py-4">{parseFloat(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav className="bg-gray-200 px-4 py-3 flex items-center justify-between border-t border-gray-200 sticky bottom-0">
          <div>
            <p className="text-sm text-gray-700">
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-950  rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-950 border  rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
      <div className="w-1/4 px-4 py-4 sticky">
        <ExpenseFilterPanel 
        onFilterChange={handleFilterChange}
        totalAmount={totalAmount} />
      </div>
      {isAddExpenseModalOpen && (
        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={toggleAddExpenseModal}
          onExpenseAdded={handleExpenseAdded}
        />
      )}
    </div>
  );
};

export default ExpenseTable;
