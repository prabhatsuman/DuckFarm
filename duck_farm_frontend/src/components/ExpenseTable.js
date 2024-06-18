import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiPlus } from "react-icons/fi";
import ExpenseFilterPanel from "./ExpenseFilterPanel.js";
import AddExpenseModal from "./AddExpenseForm.js";

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/expenses/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
        setFilteredExpenses(data); // Initialize filteredExpenses with all expenses
      } else {
        console.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
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

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownloadExcel = () => {
    const totalAmount = filteredExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );

    const data = [
      // Headers
      ["Date", "Description", "Dealer Name", "Dealer Type", "Amount"],
      // Data rows
      ...filteredExpenses.map((expense) => [
        expense.date,
        expense.description,
        expense.dealer ? expense.dealer.name : "No dealer assigned",
        expense.dealer ? expense.dealer.dealer_type : "N/A",
        parseFloat(expense.amount), // Ensure amount is parsed as a float
      ]),
      // Total amount row
      ["", "", "", "Total:", totalAmount.toFixed(2)], // Format total amount to 2 decimal places
    ];

    // Generate current date and time for file name
    const currentDate = new Date()
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/[/:]/g, "-"); // Replace slashes and colons to ensure valid file name

    const fileName = `expenses-${currentDate}.xlsx`;

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, fileName);
  };
  const toggleAddExpenseModal = () => {
    setIsAddExpenseModalOpen(!isAddExpenseModalOpen);
  };

  const handleExpenseAdded = () => {
    toggleAddExpenseModal();
    fetchExpenses();
  };

  return (
    <div className="flex flex-row m-auto w-full max-h-screen">
      {/* Main Content (Expense Table) */}
      <div className="flex flex-col w-3/4 px-4 ">
        <div className="flex items-end mb-4 justify-end">
          <div className="flex items-end justify-end">
            <div className="flex gap-2">
              <button
                onClick={handleDownloadExcel}
                className="flex items-center bg-blue-300 text-black px-4 py-2 rounded-md"
              >
                <FiDownload className="mr-2" /> Download Excel
              </button>
              <button
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={toggleAddExpenseModal}
              >
                <FiPlus className="mr-2" /> Add Expense
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-250px)]">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortColumn === "date" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("dealer")}
                >
                  Dealers
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortColumn === "amount" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4">{expense.date}</td>
                  <td className="px-6 py-4 break-words w-64">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 break-words w-72">
                    {expense.dealer
                      ? `${expense.dealer.name} (${expense.dealer.dealer_type})`
                      : "Self Expense"}
                  </td>
                  <td className="px-6 py-4">{expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sticky bottom-0">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstExpense + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastExpense, filteredExpenses.length)}
              </span>{" "}
              of <span className="font-medium">{filteredExpenses.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            {Array.from(
              { length: Math.ceil(filteredExpenses.length / expensesPerPage) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentPage === index + 1
                      ? "bg-indigo-50 border-indigo-500 text-indigo-600 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredExpenses.length / expensesPerPage)
              }
              className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage ===
                Math.ceil(filteredExpenses.length / expensesPerPage)
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar (Filter Panel) */}
      <div className="w-1/4 px-4 py-4 sticky">
        <ExpenseFilterPanel
          expenses={expenses}
          filteredExpenses={filteredExpenses}
          setFilteredExpenses={setFilteredExpenses}
          fetchExpenses={fetchExpenses}
        />
      </div>
      {/* Add Expense Modal */}
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
