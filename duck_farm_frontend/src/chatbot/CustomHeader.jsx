import React from 'react';
import { FaTimes } from 'react-icons/fa';
const CustomHeader = (toggleChatbot) => (
    <div className="flex justify-between items-center mb-2 bg-blue-500 p-2 rounded-t-lg">
      <h2 className="text-white">Chatbot</h2>
      <button onClick={toggleChatbot} className="focus:outline-none">
        <FaTimes size={20} className="text-white"/>
      </button>
    </div>
  );

export default CustomHeader;