import React from "react";

const TypeOptions = (props) => {
  const options = [
    {
      text: "Sales Data",
      handler: () => props.actionProvider.handleTypeSelection("sales","Sales Data"),
      id: 1,
    },
    {
      text: "Expense Data",
      handler: () => props.actionProvider.handleTypeSelection("expense","Expense Data"),
      id: 2,
    },
    {
      text: "Earning Data",
      handler: () => props.actionProvider.handleTypeSelection("earning","Earning Data"),
      id: 3,
    },
    {
      text:"Eggs Collected",
      handler: () => props.actionProvider.handleTypeSelection("eggs_collected","Eggs Collected"),
      id: 4,
    },
    {
      text:"Eggs Sold",
      handler: () => props.actionProvider.handleTypeSelection("eggs_sold","Eggs Sold"),
      id: 5,
    },
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

export default TypeOptions;
