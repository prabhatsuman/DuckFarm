// DataWidget.js
import React, { useState, useEffect } from "react";
import { fetchDataFromAPI } from "../DataService";

const DataWidget = ({ setState, state, actionProvider }) => {
  const { selectedType, selectedPeriod } = state;
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedType || !selectedPeriod ) {
        console.error("Selected type or period is not set or data already fetched");
        return;
      }
      if(hasFetched) return;

      try {
        const data = await fetchDataFromAPI(selectedType, selectedPeriod);
        actionProvider.handleFetchDataSuccess(data);
        setHasFetched(true); // Mark as fetched to prevent re-fetching
      } catch (error) {
        console.error("Error fetching data:", error);
        actionProvider.handleFetchDataError();
      }
    };

    fetchData();
  }, [selectedType, selectedPeriod, hasFetched, actionProvider]);

  return null;
};

export default DataWidget;
