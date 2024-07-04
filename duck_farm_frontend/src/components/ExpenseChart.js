import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import eventBus from "../utils/eventBus";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [monthlyTotalPages, setMonthlyTotalPages] = useState(1);
  const [monthlyDateRange, setMonthlyDateRange] = useState("");

  const [view, setView] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalMonthlyPagesAndData();
    };

    fetchData();

    const handleNewExpenseDataAdded = () => {
      fetchData();
    };

    eventBus.on("newExpenseDataAdded", handleNewExpenseDataAdded);

    return () => {
      eventBus.remove("newExpenseDataAdded", handleNewExpenseDataAdded);
    };
  }, []);

  const fetchTotalMonthlyPagesAndData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/expenses/monthly_view/`,
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
      console.error("Error fetching total monthly expenses:", error);
    }
  };

  const fetchMonthlyData = async (page) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/expenses/monthly_view/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      setMonthlyData(result.results);
      setMonthlyDateRange(
        `From ${result.month_range.start} to ${result.month_range.end}`
      );
    } catch (error) {
      console.error("Error fetching monthly expenses data:", error);
    }
  };

  useEffect(() => {
    if (monthlyData.length > 0) {
      setMonthlyChartData({
        labels: monthlyData.map((item) => item.month),
        datasets: [
          {
            label: "Monthly Expenses",
            data: monthlyData.map((item) => item.total_expense),
            backgroundColor: "rgba(29, 78, 256, 0.2)",
            borderColor: "1e3a8a",
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
      case "monthly":
        return (
          <Bar
            data={monthlyChartData}
            options={{
              scales: {
                x: {
                  ticks: {
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `Monthly Expenses: ₹${tooltipItem.raw.toFixed(2)}`,
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
          className="bg-blue-950 text-white py-2 px-4 rounded-md shadow-sm "
        >
          &lt;
        </button>
        <button
          onClick={() =>
            handlePageChange(
              currentPage < totalPages ? currentPage + 1 : currentPage
            )
          }
          disabled={currentPage === totalPages}
          className="bg-blue-950 text-white py-2 px-4 rounded-md shadow-sm focus:ou"
        >
          &gt;
        </button>
      </div>
    );
  };

  const handleViewChange = (e) => {
    setView(e.target.value);
    switch (e.target.value) {
      case "monthly":
        setMonthlyPage(monthlyTotalPages);
        break;
      default:
        break;
    }
  };

  const handleMonthlyPageChange = async (page) => {
    setMonthlyPage(page);
    await fetchMonthlyData(page);
  };

  return (
    <div className="expense-chart-container p-4 bg-gradient-to-b from-slate-50 to-blue-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <select
          value={view}
          onChange={handleViewChange}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="monthly">Expense Chart</option>
        </select>
        {renderPaginationButtons()}
      </div>
      <p className="text-center text-black mb-2">
        {view === "monthly" && `Month Range: ${monthlyDateRange}`}
      </p>
      {renderChart() || (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default ExpenseChart;
