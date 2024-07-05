import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AddDealerForm from "./AddDealerForm";
import EditDealerForm from "./EditDealerForm";
import DeleteDealerConfirmation from "./DeleteDealerConfirmation";
import { FiEdit, FiTrash, FiPlus, FiDownload } from "react-icons/fi";
import API_URL from "../config";

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
      const response = await fetch(`${API_URL}/api/dealer_info/`, {
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

  const handleDownloadExcel = () => {
    const data = [
      // Headers
      ["Name", "Address", "Email", "Phone Number", "Type"],
      // Data rows
      ...dealers.map((dealer) => [
        dealer.name,
        dealer.address,
        dealer.email,
        dealer.phone_number,
        dealer.dealer_type,
      ]),
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

    const fileName = `dealers-${currentDate}.xlsx`;

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dealers");

    // Save the file
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div className="m-auto  max-h-screen flex flex-col">
      <div className="flex items-center mb-4 justify-between">
        <input
          type="text"
          className="px-4 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search dealers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center bg-blue-300 text-black px-4 py-2 rounded-md"
          >
            <FiDownload className="mr-2" /> Download Excel
          </button>
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleAddDealer}
          >
            <FiPlus className="mr-2" /> Add Dealer
          </button>
        </div>
      </div>
      <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-250px)]">
        <table className="w-full divide-y divide-gray-300">
          <thead className="bg-gradient-to-br from-blue-950 to-slate-950 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="py-4 px-6  text-left text-white uppercase text-sm leading-normal"
              >
                Name
              </th>

              <th
                scope="col"
                className="py-4 px-6  text-left text-white uppercase text-sm leading-normal"
              >
                Address
              </th>
              <th
                scope="col"
                className="py-4 px-6  text-left text-white uppercase text-sm leading-normal"
              >
                Email
              </th>
              <th
                scope="col"
                className="py-4 px-6 text-left text-white uppercase text-sm leading-normal"
              >
                Phone Number
              </th>
              <th
                scope="col"
                className="py-4 px-6 text-left text-white uppercase text-sm leading-normal"
              >
                Type
              </th>
              <th
                scope="col"
                className="py-4 px-6  text-left text-white uppercase text-sm leading-normal"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 divide-y divide-gray-400 ">
            {currentDealers.map((dealer) => (
              <tr key={dealer.id}>
                <td className="px-6 py-4 w-72">{dealer.name}</td>
                <td className="px-6 py-4 w-72">{dealer.address}</td>
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
      <nav className="bg-gray-200 px-4 py-3 flex items-center justify-between border-t border-gray-200 sticky bottom-0">
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
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-950  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredDealers.length / dealersPerPage)
            }
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-950  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
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
