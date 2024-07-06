import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiPlus, FiDownload } from "react-icons/fi";
import AddStockPopup from "./AddStockPopup"; // Adjust the import path as per your folder structure
import EditStockPopup from "./EditStockPopup"; // Import the EditStockPopup component
import DeleteStockConfirmation from "./DeleteStockConfirmations"; // Import the DeleteStockConfirmation component
import * as XLSX from "xlsx";
import API_URL from "../config";

const StockTable = () => {
  const stockTypes = ["feed", "medicine", "other"];
  const [selectedStockType, setSelectedStockType] = useState("feed");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddStockPopup, setShowAddStockPopup] = useState(false); // State to control the popup visibility
  const [showEditStockPopup, setShowEditStockPopup] = useState(false); // State to control the edit popup visibility
  const [showDeleteStockPopup, setShowDeleteStockPopup] = useState(false); // State to control the delete popup visibility

  useEffect(() => {
    if (selectedStockType) {
      fetchItems(selectedStockType);
    }
  }, [selectedStockType]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, items]);

  const fetchItems = async (stockType) => {
    try {
      const response = await fetch(
        `${API_URL}/api/stocks/${stockType}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error(`Failed to fetch ${stockType} items`);
      }
    } catch (error) {
      console.error(`Error fetching ${stockType} items:`, error);
    }
  };

  const handleStockTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedStockType(selectedType);
    setSelectedItem({});
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditStockPopup(true);
  };

  const handleUpdate = async () => {
    setShowEditStockPopup(false);
    fetchItems(selectedStockType);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteStockPopup(true);
  };

  const handleAddStock = () => {
    setShowAddStockPopup(true); // Open the popup when Add Stock is clicked
  };

  const handleAddSuccess = () => {
    fetchItems(selectedStockType); // Refresh items after adding new stock
    setShowAddStockPopup(false); // Close the popup after successful addition
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    const sortValue = (value, column) => {
      switch (column) {
        case "name":
        case "brand":
          return value.toLowerCase();
        case "quantity":
        case "price":
          return Number(value);
        case "date_of_purchase":
        case "date_of_expiry":
          return Date.parse(value);
        default:
          return value;
      }
    };

    const aValue = sortValue(a[sortBy], sortBy);
    const bValue = sortValue(b[sortBy], sortBy);

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (
      pageNumber !== currentPage &&
      pageNumber > 0 &&
      pageNumber <= Math.ceil(filteredItems.length / itemsPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };
  const handleDownloadExcel = () => {
    // Prepare the data for the Excel file
    const data = [
      // Headers
      [
        "Item Name",
        selectedStockType !== "other" ? "Brand" : "",
        "Quantity",
        "Price",
        "Date of Purchase",
        selectedStockType === "medicine" ? "Date of Expiry" : "",
      ],
      // Data rows
      ...sortedItems.map((item) => [
        item.name,
        selectedStockType !== "other" ? item.brand : "",
        item.quantity,
        item.price,
        item.date_of_purchase,
        selectedStockType === "medicine" ? item.date_of_expiry : "",
      ]),
    ];

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stocks");

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

    const fileName = `stocks-${selectedStockType}-${currentDate}.xlsx`;

    // Write the workbook to a file
    XLSX.writeFile(workbook, fileName);
  };

  const renderAttributes = (item) => {
    switch (selectedStockType) {
      case "feed":
      case "medicine":
        return (
          <>
            <td className="py-4 px-6 text-center">{item.brand}</td>
            <td className="py-4 px-12 text-center">{item.quantity}</td>
            <td className="py-4 px-6 text-center">{item.price}</td>
            <td className="py-4 px-10 text-center">{item.date_of_purchase}</td>
            {selectedStockType === "medicine" && (
              <td className="py-4 px-8 text-center">{item.date_of_expiry}</td>
            )}
          </>
        );
      case "other":
        return (
          <>
            <td className="py-4 px-12 text-center">{item.quantity}</td>
            <td className="py-4 px-6 text-center">{item.price}</td>
            <td className="py-4 px-8 text-center">{item.date_of_purchase}</td>
          </>
        );
      default:
        return null;
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
    }
    return null;
  };

  return (
    <div className="m-auto w-full max-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="px-4 py-2 border border-gray-600 rounded-md"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center">
          <label htmlFor="stockTypeSelect" className="mr-2">
            Select Stock Type:
          </label>
          <select
            id="stockTypeSelect"
            value={selectedStockType}
            onChange={handleStockTypeChange}
            className="border rounded-md p-2 mr-4 border-gray-600"
          >
            <option value="">-- Select Stock Type --</option>
            {stockTypes.map((stockType) => (
              <option key={stockType} value={stockType}>
                {stockType}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center bg-blue-300 text-black px-4 py-2 rounded-md"
          >
            <FiDownload className="mr-2" /> Download Excel
          </button>
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleAddStock}
          >
            <FiPlus className="mr-2" /> Add Stock
          </button>
        </div>
      </div>
      {selectedStockType && (
        <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-250px)]">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-br from-blue-950 to-slate-950 sticky top-0 z-10 border-solid">
              <tr>
                <th
                  className="py-4 px-6 text-white text-center uppercase text-sm leading-normal"
                  onClick={() => handleSort("name")}
                >
                  Item {renderSortIcon("name")}
                </th>
                {selectedStockType !== "other" && (
                  <th
                    className="py-4 px-6 text-white text-center uppercase text-sm leading-normal"
                    onClick={() => handleSort("brand")}
                  >
                    Brand {renderSortIcon("brand")}
                  </th>
                )}
                <th
                  className="py-4 px-12 text-white text-center uppercase text-sm leading-normal"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity {renderSortIcon("quantity")}
                </th>
                <th
                  className="py-4 px-6 text-white text-center uppercase text-sm leading-normal"
                  onClick={() => handleSort("price")}
                >
                  Price {renderSortIcon("price")}
                </th>
                <th
                  className="py-4 px-10 text-white text-center uppercase text-sm leading-normal"
                  onClick={() => handleSort("date_of_purchase")}
                >
                  Date of Purchase {renderSortIcon("date_of_purchase")}
                </th>
                {selectedStockType === "medicine" && (
                  <th
                    className="py-4 px-8 text-white text-center uppercase text-sm leading-normal"
                    onClick={() => handleSort("date_of_expiry")}
                  >
                    Date of Expiry {renderSortIcon("date_of_expiry")}
                  </th>
                )}
                <th className="py-4 px-6 text-white text-left uppercase text-sm leading-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 divide-y divide-gray-400">
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-6 text-center">{item.name}</td>
                  {renderAttributes(item)}
                  <td className="py-4 px-6">
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(item)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item)}
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filteredItems.length > itemsPerPage && (
        <nav className="bg-gray-200 px-4 py-3 flex items-center justify-between  sticky bottom-0">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredItems.length)}
              </span>{" "}
              of <span className="font-medium">{filteredItems.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex space-x-2 ">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
           
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </nav>
      )}
      {showAddStockPopup && (
        <AddStockPopup
          onClose={() => setShowAddStockPopup(false)}
          onCreate={handleAddSuccess}
        />
      )}
      {showEditStockPopup && (
        <EditStockPopup
          item={selectedItem}
          stockType={selectedStockType}
          onClose={() => setShowEditStockPopup(false)}
          onUpdate={handleUpdate}
        />
      )}
      {showDeleteStockPopup && (
        <DeleteStockConfirmation
          item={selectedItem}
          stockType={selectedStockType}
          onClose={() => setShowDeleteStockPopup(false)}
          onStockDeleted={() => {
            fetchItems(selectedStockType);
            setShowDeleteStockPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default StockTable;
