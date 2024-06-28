import React from "react";

const AskMoreWidget = ({ actionProvider }) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={actionProvider.handleAskMoreQuestions}
          className="px-4 py-2 text-gray-800 text-xs bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-full"
        >
          Ask More Questions
        </button>
       
      </div>
    </div>
  );
};

export default AskMoreWidget;
