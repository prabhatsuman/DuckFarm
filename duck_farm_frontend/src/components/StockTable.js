import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiPlus, FiChevronUp, FiChevronDown } from "react-icons/fi";
import AddStockPopup from "./AddStockPopup"; // Adjust the import path as per your folder structure
import EditStockPopup from "./EditStockPopup"; // Import the EditStockPopup component
import DeleteStockConfirmation from "./DeleteStockConfirmations"; // Import the DeleteStockConfirmation component

const StockTable = () => {
  const stockTypes = ["feed", "medicine", "other"];
  const [selectedStockType, setSelectedStockType] = useState("");
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
  const[showDeleteStockPopup, setShowDeleteStockPopup] = useState(false); // State to control the delete popup visibility

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
        `http://127.0.0.1:8000/api/stocks/${stockType}/`,
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

  const renderAttributes = (item) => {
    switch (selectedStockType) {
      case "feed":
      case "medicine":
        return (
          <>
            <td className="py-4 px-6">{item.brand}</td>
            <td className="py-4 px-12">{item.quantity}</td>
            <td className="py-4 px-6">{item.price}</td>
            <td className="py-4 px-10">{item.date_of_purchase}</td>
            {selectedStockType === "medicine" && (
              <td className="py-4 px-8">{item.date_of_expiry}</td>
            )}
          </>
        );
      case "other":
        return (
          <>
            <td className="py-4 px-12">{item.quantity}</td>
            <td className="py-4 px-6">{item.price}</td>
            <td className="py-4 px-8">{item.date_of_purchase}</td>
          </>
        );
      default:
        return null;
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />;
    }
    return null;
  };

  return (
    <div className="m-auto w-full max-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            className="border rounded-md p-2 mr-4"
          >
            <option value="">-- Select Stock Type --</option>
            {stockTypes.map((stockType) => (
              <option key={stockType} value={stockType}>
                {stockType}
              </option>
            ))}
          </select>
        </div>
        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handleAddStock}
        >
          <FiPlus className="mr-2" /> Add Stock
        </button>
      </div>
      {selectedStockType && (
        <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-250px)]">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-50 sticky top-0 z-10 border-solid">
              <tr>
                <th
                  className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
                  onClick={() => handleSort("name")}
                >
                  Item {renderSortIcon("name")}
                </th>
                {selectedStockType !== "other" && (
                  <th
                    className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
                    onClick={() => handleSort("brand")}
                  >
                    Brand {renderSortIcon("brand")}
                  </th>
                )}
                <th
                  className="py-4 px-12 bg-gray-100 text-left uppercase text-sm leading-normal"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity {renderSortIcon("quantity")}
                </th>
                <th
                  className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
                  onClick={() => handleSort("price")}
                >
                  Price {renderSortIcon("price")}
                </th>
                <th
                  className="py-4 px-10 bg-gray-100 text-left uppercase text-sm leading-normal"
                  onClick={() => handleSort("date_of_purchase")}
                >
                  Date of Purchase {renderSortIcon("date_of_purchase")}
                </th>
                {selectedStockType === "medicine" && (
                  <th
                    className="py-4 px-8 bg-gray-100 text-left uppercase text-sm leading-normal"
                    onClick={() => handleSort("date_of_expiry")}
                  >
                    Date of Expiry {renderSortIcon("date_of_expiry")}
                  </th>
                )}
                <th className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-6">{item.name}</td>
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
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sticky bottom-0">
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
              { length: Math.ceil(filteredItems.length / itemsPerPage) },
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
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
              className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          stockType={selectedStockType}
          onClose={() => setShowAddStockPopup(false)}
          onAddSuccess={handleAddSuccess}
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
      {
        showDeleteStockPopup && (
          <DeleteStockConfirmation
            item={selectedItem}
            stockType={selectedStockType}
            onClose={() => setShowDeleteStockPopup(false)}
            onStockDeleted={() => {
              fetchItems(selectedStockType);
              setShowDeleteStockPopup(false);
            }}
          />
        )
      }
    </div>
  );
};

export default StockTable;
