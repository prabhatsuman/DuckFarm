import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import API_URL from "../config";
import eventBus from "../utils/eventBus";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [dailyPage, setDailyPage] = useState(1);
  const [dailyChartData, setDailyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [dailyTotalPages, setDailyTotalPages] = useState(1);
  const [dailyDateRange, setDailyDateRange] = useState("");

  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [monthlyTotalPages, setMonthlyTotalPages] = useState(1);
  const [monthlyDateRange, setMonthlyDateRange] = useState("");

  const [view, setView] = useState("daily");

  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalDailyPages();
      await fetchTotalMonthlyPages();
    };

    fetchData();
      const handleNewSalesDataAdded = () => {
      fetchData();
    };
    eventBus.on("newSalesDataAdded", handleNewSalesDataAdded);
    return () => {
      eventBus.remove("newSalesDataAdded", handleNewSalesDataAdded);
    };

  
  }, []);

  

  const fetchTotalDailyPages = async () => {
    try {
      // Replace the API endpoint with your actual endpoint for daily view
      const response = await fetch(
        `${API_URL}/api/sales/daily_view/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      setDailyTotalPages(result.count);

      setDailyPage(result.count);
      await fetchDailyData(result.count);
      
    } catch (error) {
      console.error("Error fetching total daily pages:", error);
    }
  };

  const fetchTotalMonthlyPages = async () => {
    try {
      // Replace the API endpoint with your actual endpoint for monthly view
      const response = await fetch(
        `${API_URL}/api/sales/monthly_view/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      setMonthlyTotalPages(result.count);
      setMonthlyPage(result.count);
      await fetchMonthlyData(result.count);
     
    } catch (error) {
      console.error("Error fetching total monthly pages:", error);
    }
  };

 
  const fetchDailyData = async (page) => {
    try {
      // Replace the API endpoint with your actual endpoint for daily view
      const response = await fetch(
        `${API_URL}/api/sales/daily_view/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      setDailyData(result.results);

      setDailyDateRange(
        `From ${result.date_range.start} to ${result.date_range.end}`
      );
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  };

  const fetchMonthlyData = async (page) => {
    try {
      // Replace the API endpoint with your actual endpoint for monthly view
      const response = await fetch(
        `${API_URL}/api/sales/monthly_view/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      setMonthlyData(result.results);
      setMonthlyTotalPages(result.count);
      setMonthlyDateRange(
        `From ${result.month_range.start} to ${result.month_range.end}`
      );
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const handleDailyPageChange = async (page) => {
    setDailyPage(page);
    await fetchDailyData(page);
  };

  const handleMonthlyPageChange = async (page) => {
    setMonthlyPage(page);
    await fetchMonthlyData(page);
  };

  useEffect(() => {
    if (dailyData.length > 0) {
      setDailyChartData({
        labels: dailyData.map((item) => item.day),
        datasets: [
          {
            label: "Daily Sales",
            data: dailyData.map((item) => item.sales),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
        ],
      });
    } else {
      setDailyChartData({ labels: [], datasets: [] });
    }
  }, [dailyData]);

  useEffect(() => {
    if (monthlyData.length > 0) {
      setMonthlyChartData({
        labels: monthlyData.map((item) => item.month),
        datasets: [
          {
            label: "Monthly Sales",
            data: monthlyData.map((item) => item.sales),
            backgroundColor: "rgba(192,75,192,0.2)",
            borderColor: "rgba(192,75,192,1)",
            borderWidth: 1,
          },
        ],
      });
    } else {
      setMonthlyChartData({ labels: [], datasets: [] });
    }
  }, [monthlyData]);

  const renderChart = () => {
    switch (view) {
      case "daily":
        return (
          <Line
            data={dailyChartData}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    title: (tooltipItem) =>
                      `${dailyData[tooltipItem[0].dataIndex].date}`,
                    label: (tooltipItem) =>
                      `Daily Sales: ₹${tooltipItem.raw.toFixed(2)}`,
                  },
                },
              },
            }}
          />
        );
      case "monthly":
        return (
          <Bar
            data={monthlyChartData}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `Monthly Sales: ₹${tooltipItem.raw.toFixed(2)}`, // Adding ₹ symbol
                  },
                },
              },
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderPaginationButtons = () => {
    let totalPages;
    let currentPage;
    let handlePageChange;

    switch (view) {
      case "daily":
        totalPages = dailyTotalPages;
        currentPage = dailyPage;
        handlePageChange = handleDailyPageChange;
        break;
      case "monthly":
        totalPages = monthlyTotalPages;
        currentPage = monthlyPage;
        handlePageChange = handleMonthlyPageChange;
        break;
      default:
        totalPages = 1;
        currentPage = 1;
        handlePageChange = () => {};
    }

    return (
      <div className="flex space-x-2">
        <button
          onClick={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)
          }
          disabled={currentPage === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          &lt; Prev
        </button>
        <button
          onClick={() =>
            handlePageChange(
              currentPage < totalPages ? currentPage + 1 : currentPage
            )
          }
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          Next &gt;
        </button>
      </div>
    );
  };

  const handleViewChange = (e) => {
    setView(e.target.value);
    switch (e.target.value) {
      case "daily":
        setDailyPage(dailyTotalPages);
        break;
      case "monthly":
        setMonthlyPage(monthlyTotalPages);
        break;
      default:
        break;
    }
  };

  return (
    <div className="sales-chart-container p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <select
          value={view}
          onChange={handleViewChange}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
        {renderPaginationButtons()}
      </div>
      <p className="text-center text-gray-500 mb-2">
        {view === "daily" && `Date Range: ${dailyDateRange}`}
        {view === "monthly" && `Month Range: ${monthlyDateRange}`}
      </p>
      {renderChart() || (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default SalesChart;
