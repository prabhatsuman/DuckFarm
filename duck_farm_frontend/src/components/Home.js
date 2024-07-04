import React, { useState } from "react";
import DuckCard from "./DuckCard";
import EggCard from "./EggCard";
import EarningCard from "./EarningCard";
import FeedStockCard from "./FeedStockCard";
import EggCollectionChart from "./EggCollectionChart";
import SalesChart from "./SalesChart";
import ExpenseChart from "./ExpenseChart";
import EarningChart from "./EarningChart";
import { FiChevronLeft, FiChevronRight, FiMessageCircle } from "react-icons/fi";
import ChatBotPopup from "./ChatBotPopup";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage === 1 ? 2 : 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage === 2 ? 1 : 2));
  };

  return (
    <div className="px-6 py-3">
      {/* Cards Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-slate-300 overflow-hidden shadow rounded-lg">
          <DuckCard logoUrl="/images/duck_logo.png" />
        </div>

        {/* Card 2 */}
        <div className="bg-slate-300 overflow-hidden shadow rounded-lg">
          <EggCard logoUrl="/images/egg_logo.png" />
        </div>

        {/* Card 3 */}
        <div className="bg-slate-300 overflow-hidden shadow rounded-lg">
          <FeedStockCard logoUrl="/images/feed_logo.png" />
        </div>

        {/* Card 4 */}
        <div className="bg-slate-300 overflow-hidden shadow rounded-lg">
          <EarningCard logoUrl="/images/earning_logo.png" />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-3 flex justify-end space-x-4">
        <button
          onClick={handlePrevPage}
          className="bg-gray-200 text-black-700 p-3 rounded-full shadow"
          disabled={currentPage === 1}
        >
          <FiChevronLeft size={12} />
        </button>
        <button
          onClick={handleNextPage}
          className="bg-gray-200 text-black-700 p-3 rounded-full shadow"
          disabled={currentPage === 2}
        >
          <FiChevronRight size={12} />
        </button>
      </div>

      {/* Graphs Section */}
      {currentPage === 1 ? (
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Graph 1 */}
          <div className=" overflow-hidden shadow rounded-lg">
            <EggCollectionChart />
          </div>

          {/* Graph 2 */}
          <div className=" overflow-hidden shadow rounded-lg">
            <SalesChart />
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Graph 3 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <ExpenseChart />
          </div>

          {/* Graph 4 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <EarningChart />
          </div>
        </div>
      )}
      <ChatBotPopup />
    </div>
  );
};

export default Home;
