import React, { useEffect } from "react";
import { useQuery } from "react-query";
import eventBus from "../utils/eventBus";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faIndianRupeeSign} from '@fortawesome/free-solid-svg-icons';
import API_URL from "../config";

const fetchTotalEarnings = async () => {
  const response = await fetch(
    `${API_URL}/api/earnings/this_month/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.total_earnings;
};

const EarningCard = () => {
  const { data: totalEarnings, isLoading, error ,refetch} = useQuery(
    ['totalEarnings'],
    fetchTotalEarnings,{
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
  useEffect(() => {
    const EarningHandler = () => {
      refetch();
    };
    eventBus.on("newEarningDataAdded", EarningHandler);
    return () => {
      eventBus.remove("newEarningDataAdded", EarningHandler);
    };
  }, [refetch]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-900">Total Earnings</h3>
          <p className="mt-2 text-black text-left">
            &#8377;{totalEarnings.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faIndianRupeeSign} size="5x" className=" text-gray-950" />
        </div>
      </div>
    </div>
  );
};

export default EarningCard;
