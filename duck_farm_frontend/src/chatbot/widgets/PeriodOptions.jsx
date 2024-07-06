import React from "react";

const PeriodOptions = (props) => {
  const options = [
    { text: "Today", handler: () => props.actionProvider.handlePeriodSelection("today","Today"), id: 1 },
    { text: "This Week", handler: () => props.actionProvider.handlePeriodSelection("this_week", "This Week"), id: 2 },
    { text: "This Month", handler: () => props.actionProvider.handlePeriodSelection("this_month", "This Month"), id: 3 },
    { text: "Last Week", handler: () => props.actionProvider.handlePeriodSelection("last_week", "Last Week"), id: 4 },
    { text: "Last Month", handler: () => props.actionProvider.handlePeriodSelection("last_month","Last Month"), id: 5 },
    { text: "Last 3 Months", handler: () => props.actionProvider.handlePeriodSelection("last_3_months", "Last 3 Months"), id: 6 },
    { text: "Last 6 Months", handler: () => props.actionProvider.handlePeriodSelection("last_6_months","Last 6 Months"), id: 7 },
  ];

  return (
    <div className="flex justify-center mt-4">
      <div className="flex flex-wrap justify-center gap-2 items-center">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={option.handler}
            className="px-4 py-2 text-gray-800 text-xs bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-full"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PeriodOptions;
