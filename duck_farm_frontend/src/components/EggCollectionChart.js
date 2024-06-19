import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EggCollectionChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [dailyPage, setDailyPage] = useState(1);
  const [dailyChartData, setDailyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [dailyTotalPages, setDailyTotalPages] = useState(1);
  const [dailyDateRange, setDailyDateRange] = useState("");

  // const [monthlyData, setMonthlyData] = useState([]);
  // const [monthlyPage, setMonthlyPage] = useState(1);
  // const [monthlyChartData, setMonthlyChartData] = useState({ labels: [], datasets: [] });
  // const [monthlyTotalPages, setMonthlyTotalPages] = useState(1);
  // const [monthlyDateRange, setMonthlyDateRange] = useState('');

  // const [yearlyData, setYearlyData] = useState([]);
  // const [yearlyPage, setYearlyPage] = useState(1);
  // const [yearlyChartData, setYearlyChartData] = useState({ labels: [], datasets: [] });
  // const [yearlyTotalPages, setYearlyTotalPages] = useState(1);
  // const [yearlyDateRange, setYearlyDateRange] = useState('');

  const [view, setView] = useState("daily"); // Initialize view state

  useEffect(() => {
    fetchTotalDailyPages(); // Fetch total pages initially
  }, []);
   // Only run this effect once when component mounts
   const fetchTotalDailyPages = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/egg_stock/daily_view/`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      setDailyTotalPages(result.count); 
      
      setDailyPage(result.count);
      fetchDailyData(result.count); // Fetch data for the last page initially
      setDailyDateRange(
        `From ${result.date_range.start} to ${result.date_range.end}`
      );
    } catch (error) {
      console.error("Error fetching total pages:", error);
    }
  };

  useEffect(() => {
    fetchDailyData(dailyPage);
  }, [dailyPage]);

  // useEffect(() => {
  //     fetchMonthlyData(monthlyPage);
  // }, [monthlyPage]);

  // useEffect(() => {
  //     fetchYearlyData(yearlyPage);
  // }, [yearlyPage]);

  const fetchDailyData = async (page) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/egg_stock/daily_view/?page=${page}`,
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

  // const fetchMonthlyData = async (page) => {
  //     try {
  //         const response = await fetch(`http://127.0.0.1:8000/api/egg_stock/monthly_view/?page=${page}`, {
  //             headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //         });
  //         const result = await response.json();
  //         setMonthlyData(result.results);
  //         setMonthlyTotalPages(result.total_pages);
  //         setMonthlyDateRange(`From ${result.date_range.start} to ${result.date_range.end}`);
  //     } catch (error) {
  //         console.error('Error fetching monthly data:', error);
  //     }
  // };

  // const fetchYearlyData = async (page) => {
  //     try {
  //         const response = await fetch(`http://127.0.0.1:8000/api/egg_stock/yearly_view/?page=${page}`, {
  //             headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //         });
  //         const result = await response.json();
  //         setYearlyData(result.results);
  //         setYearlyTotalPages(result.total_pages);
  //         setYearlyDateRange(`From ${result.date_range.start} to ${result.date_range.end}`);
  //     } catch (error) {
  //         console.error('Error fetching yearly data:', error);
  //     }
  // };

  const handleDailyPageChange = (page) => {
    setDailyPage(page);
  };

  // const handleMonthlyPageChange = (page) => {
  //     setMonthlyPage(page);
  // };

  // const handleYearlyPageChange = (page) => {
  //     setYearlyPage(page);
  // };


  useEffect(() => {
    if (dailyData.length > 0) {
        console.log(dailyData);
      setDailyChartData({
        labels: dailyData.map((item) => item.day),
        datasets: [
          {
            label: "Daily Egg Collection",
            data: dailyData.map((item) => item.eggs),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
        ],
      });
    } else {
      setDailyChartData({ labels: [], datasets: [] });
    }
  }, [dailyData]);

  // useEffect(() => {
  //     if (monthlyData.length > 0) {
  //         setMonthlyChartData({
  //             labels: monthlyData.map(item => item.month),
  //             datasets: [
  //                 {
  //                     label: 'Monthly Egg Collection',
  //                     data: monthlyData.map(item => item.quantity),
  //                     borderColor: 'rgba(192,75,192,1)',
  //                     backgroundColor: 'rgba(192,75,192,0.2)',
  //                 },
  //             ],
  //         });
  //     } else {
  //         setMonthlyChartData({ labels: [], datasets: [] });
  //     }
  // }, [monthlyData]);

  // useEffect(() => {
  //     if (yearlyData.length > 0) {
  //         setYearlyChartData({
  //             labels: yearlyData.map(item => item.year),
  //             datasets: [
  //                 {
  //                     label: 'Yearly Egg Collection',
  //                     data: yearlyData.map(item => item.quantity),
  //                     borderColor: 'rgba(192,192,75,1)',
  //                     backgroundColor: 'rgba(192,192,75,0.2)',
  //                 },
  //             ],
  //         });
  //     } else {
  //         setYearlyChartData({ labels: [], datasets: [] });
  //     }
  // }, [yearlyData]);

  const renderChart = () => {
    switch (view) {
      case "daily":
        return <Line data={dailyChartData} />;
      // case 'monthly':
      //     return (
      //         <Line data={monthlyChartData} />
      //     );
      // case 'yearly':
      //     return (
      //         <Line data={yearlyChartData} />
      //     );
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
      // case 'monthly':
      //     totalPages = monthlyTotalPages;
      //     currentPage = monthlyPage;
      //     handlePageChange = handleMonthlyPageChange;
      //     break;
      // case 'yearly':
      //     totalPages = yearlyTotalPages;
      //     currentPage = yearlyPage;
      //     handlePageChange = handleYearlyPageChange;
      //     break;
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
    // Reset page for the selected view
    switch (e.target.value) {
      case "daily":
        setDailyPage(dailyTotalPages);
        break;
      // case 'monthly':
      //     setMonthlyPage(1);
      //     break;
      // case 'yearly':
      //     setYearlyPage(1);
      //     break;
      default:
        break;
    }
  };

  return (
    <div className="egg-collection-chart-container p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <select
          value={view}
          onChange={handleViewChange}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="daily">Daily</option>
          {/* <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option> */}
        </select>
        {renderPaginationButtons()}
      </div>
      <p className="text-center text-gray-500 mb-2">
        {view === "daily" && `Date Range: ${dailyDateRange}`}
        {/* {view === 'monthly' && `Date Range: ${monthlyDateRange}`}
                {view === 'yearly' && `Date Range: ${yearlyDateRange}`} */}
      </p>
      {renderChart() || (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default EggCollectionChart;
