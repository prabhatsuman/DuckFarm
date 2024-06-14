import React, { useState, useEffect } from "react";
import AddDealerForm from "./AddDealerForm";
import EditDealerForm from "./EditDealerForm";
import DeleteDealerConfirmation from "./DeleteDealerConfirmation";
import {
  FiEdit,
  FiTrash,
  FiPlus,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

const DealerInfo = () => {
  const [dealers, setDealers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dealersPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);

  useEffect(() => {
    fetchDealers();
  }, []);

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
        setFilteredDealers(data);
      } else {
        console.error("Failed to fetch dealers");
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };

  // Pagination
  const indexOfLastDealer = currentPage * dealersPerPage;
  const indexOfFirstDealer = indexOfLastDealer - dealersPerPage;
  const currentDealers = filteredDealers.slice(
    indexOfFirstDealer,
    indexOfLastDealer
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Search functionality
  useEffect(() => {
    const results = dealers.filter((dealer) =>
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDealers(results);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, dealers]);

  const handleAddDealer = () => {
    setIsAddModalOpen(true);
  };

  const handleEditDealer = (dealer) => {
    setSelectedDealer(dealer);
    setIsEditModalOpen(true);
  };

  const handleDeleteDealer = (dealer) => {
    setSelectedDealer(dealer);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleDealerAdded = () => {
    setIsAddModalOpen(false);
    fetchDealers();
  };

  const handleDealerUpdated = () => {
    setIsEditModalOpen(false);
    fetchDealers();
  };

  const handleDealerDeleted = () => {
    setIsDeleteModalOpen(false);
    fetchDealers();
  };

  return (
    <div className="m-auto w-full max-h-screen flex flex-col">
      <div className="flex items-center mb-4 justify-between">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search dealers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddDealer}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Dealer
        </button>
      </div>
      <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-250px)]">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Name
              </th>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Description
              </th>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Address
              </th>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Email
              </th>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Phone Number
              </th>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Type
              </th>
              <th
                scope="col"
                className="py-4 px-6 bg-gray-100 text-left uppercase text-sm leading-normal"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDealers.map((dealer) => (
              <tr key={dealer.id}>
                <td className="px-6 py-4">{dealer.name}</td>
                <td className="px-6 py-4">{dealer.description}</td>
                <td className="px-6 py-4">{dealer.address}</td>
                <td className="px-6 py-4">{dealer.email}</td>
                <td className="px-6 py-4">{dealer.phone_number}</td>
                <td className="px-6 py-4">{dealer.dealer_type}</td>
                <td className="px-6 py-4 gap-3">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditDealer(dealer)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteDealer(dealer)}
                      className="text-red-600 hover:text-red-900"
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
      <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sticky bottom-0">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{indexOfFirstDealer + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastDealer, filteredDealers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredDealers.length}</span>{" "}
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
            { length: Math.ceil(filteredDealers.length / dealersPerPage) },
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
              currentPage === Math.ceil(filteredDealers.length / dealersPerPage)
            }
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === Math.ceil(filteredDealers.length / dealersPerPage)
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      </nav>
      {isAddModalOpen && (
        <AddDealerForm
          onClose={handleModalClose}
          onDealerAdded={handleDealerAdded}
        />
      )}
      {isEditModalOpen && (
        <EditDealerForm
          dealer={selectedDealer}
          onClose={handleModalClose}
          onDealerUpdated={handleDealerUpdated}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteDealerConfirmation
          dealer={selectedDealer}
          onClose={handleModalClose}
          onDealerDeleted={handleDealerDeleted}
        />
      )}
    </div>
  );
};

export default DealerInfo;
