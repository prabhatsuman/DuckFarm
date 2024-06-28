import React, { useState } from "react";
import { Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../chatbot/config";
import ActionProvider from "../chatbot/ActionProvider";
import MessageParser from "../chatbot/MessageParser";
import { FaTimes, FaComments } from "react-icons/fa"; // Import icons from FontAwesome

const ChatBotPopup = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const CustomHeader = ({ onClose }) => (
    <div className="flex justify-between items-center mb-2 bg-blue-500 p-2 rounded-t-lg">
      <h2 className="text-white">Chatbot</h2>
      <button onClick={onClose} className="focus:outline-none">
        <FaTimes size={20} className="text-white" />
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4">
      {showChatbot && (
        
          
          <Chatbot
            config={{
              ...config,
              customComponents: {
                header: () => <CustomHeader onClose={toggleChatbot} />,
              },
            }} // Include custom header in config
            actionProvider={ActionProvider}
            messageParser={MessageParser}
          />
        
      )}
      {!showChatbot && (
        <button
          onClick={toggleChatbot}
          className="chatbot-toggle-btn p-2 bg-blue-500 text-white rounded-full shadow-lg focus:outline-none"
        >
          <FaComments size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatBotPopup;
