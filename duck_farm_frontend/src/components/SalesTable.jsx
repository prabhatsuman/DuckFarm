import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiPlus } from "react-icons/fi";
import SalesFilterPanel from "./SalesFilterPanel";
import AddSalesModal from "./AddSalesForm";
import API_URL from "../config";

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [salesPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAddSalesModalOpen, setIsAddSalesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQauntity, setTotalQauntity] = useState(0);

  useEffect(() => {
    fetchSales();
  }, [
    currentPage,
    startDate,
    endDate,
    searchTerm,
    minAmount,
    maxAmount,
    selectedDealer,
  ]);

  const fetchSales = async () => {
    try {
      const apiUrl = `${API_URL}/api/sales/`;

      // Define query parameters with initial values
      const queryParams = {
        page: currentPage,
        page_size: 10, // Assuming page size is fixed or dynamically set
      };
      console.log(
        maxAmount,
        minAmount,
        searchTerm,
        startDate,
        endDate,
        selectedDealer
      );

      // Add search term if defined and not empty
      if (searchTerm.trim() !== "") {
        queryParams.searchTerm = searchTerm.trim();
      }

      // Add start date if defined and valid
      if (startDate instanceof Date && !isNaN(startDate)) {
        queryParams.startDate = startDate.toISOString().substr(0, 10);
      }

      // Add end date if defined and valid
      if (endDate instanceof Date && !isNaN(endDate)) {
        queryParams.endDate = endDate.toISOString().substr(0, 10);
      }

      // Add min amount if defined and valid
      if (minAmount !== "" && !isNaN(parseFloat(minAmount))) {
        queryParams.minAmount = parseInt(minAmount, 10); // Convert to integer
      }

      // Add max amount if defined and valid
      if (maxAmount !== "" && !isNaN(parseFloat(maxAmount))) {
        queryParams.maxAmount = parseInt(maxAmount, 10); // Convert to integer
      }

      // Add selected dealer if defined
      if (selectedDealer.trim() !== "") {
        queryParams.selectedDealer = selectedDealer.trim();
      }

      // Construct the URL with query parameters
      const url = new URL(apiUrl);
      url.search = new URLSearchParams(queryParams).toString();

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSales(data.results);
        setFilteredSales(data.results); // Assuming results is the list of sales data
        setTotalPages(data.total_pages);
        // Update totalPages based on API response
        setTotalAmount(data.total_amount); // Update totalAmount based on API response
        setTotalQauntity(data.total_quantity); // Update totalQauntity based on API response
      } else {
        console.error("Failed to fetch sales");
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setSearchTerm(newFilters.searchTerm);
    setStartDate(newFilters.startDate);
    setEndDate(newFilters.endDate);
    setMinAmount(newFilters.minAmount);
    setMaxAmount(newFilters.maxAmount);
    setSelectedDealer(newFilters.selectedDealer);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const sortSales = (data) => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      if (sortColumn === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortColumn === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortColumn === "quantity") {
        return sortOrder === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
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

    const sortedSales = sortSales(filteredSales);
    setFilteredSales(sortedSales);
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "sales_data.xlsx");
  };

  const toggleAddSalesModal = () => {
    setIsAddSalesModalOpen(!isAddSalesModalOpen);
  };

  const handleSalesAdded = () => {
    fetchSales(); // Refresh the sales data after adding new sales
    toggleAddSalesModal(); // Close the modal after adding sales
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="flex flex-row m-auto w-full max-h-screen">
      <div className="flex flex-col w-3/4 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Sales Data</h1>
          <div className="flex space-x-2">            
            <button
              onClick={handleDownloadExcel}
              className="flex items-center bg-blue-300 text-black px-4 py-2 rounded-md"
            >
              <FiDownload className="mr-2" /> Download Excel
            </button>
            <button
              onClick={toggleAddSalesModal}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              <FiPlus className="mr-2" /> Add Sale
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
                  Date{" "}
                  {sortColumn === "date" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal cursor-pointer"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal cursor-pointer"
                >
                  Dealer
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity{" "}
                  {sortColumn === "quantity" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="py-4 px-6 text-white text-left uppercase text-sm leading-normal cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount{" "}
                  {sortColumn === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 divide-y divide-gray-400">
              {filteredSales.map((sale, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {sale.description}
                  </td>
                  <td className="px-6 py-4">
                    {sale.dealer ? (
                      <div>
                        <div>{sale.dealer.name}</div>
                        <div className="text-xs text-gray-500">
                          {sale.dealer.dealer_type}
                        </div>
                      </div>
                    ) : (
                      "No dealer assigned"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4">
                    {sale.amount}
                  </td>
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
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-950  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-950  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
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
      <div className="w-1/4 p-4 sticky">
        <SalesFilterPanel
          onFilterChange={handleFilterChange}
          totalAmount={totalAmount}
          totalQauntity={totalQauntity}
        />
      </div>
      {isAddSalesModalOpen && (
        <AddSalesModal
          isOpen={isAddSalesModalOpen}
          onClose={toggleAddSalesModal}
          onSalesAdded={handleSalesAdded}
        />
      )}
    </div>
  );
};

export default SalesTable;
