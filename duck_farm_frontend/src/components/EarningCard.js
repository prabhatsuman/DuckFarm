import React, { useState, useEffect } from "react";
import API_URL from "../config";

const EarningCard = ({ logoUrl }) => {
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchTotalEarnings();
  }, []);

  const fetchTotalEarnings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/earnings/this_month/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTotalEarnings(data.total_earnings);
      } else {
        console.error("Failed to fetch total earnings");
      }
    } catch (error) {
      console.error("Error fetching total earnings:", error);
    }
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="Earning Logo"
            className="object-cover h-16 w-16 mr-3"
          />
        </div>
        <div className="flex flex-col items-end relative justify-center">
          <h3 className="text-lg font-medium text-gray-900 text-wrap">
            Total Earnings
          </h3>
          <p className="mt-2 text-sm text-gray-500 text-right">
            &#8377;{totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EarningCard;
