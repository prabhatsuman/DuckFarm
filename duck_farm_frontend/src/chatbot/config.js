import { createChatBotMessage } from "react-chatbot-kit";
import TypeOptions from "./widgets/TypeOptions";
import PeriodOptions from "./widgets/PeriodOptions";
import DataWidget from "./widgets/DataWidget";
import AskMoreWidget from "./widgets/AskMoreWidget";

const config = {
  botName: "DataFetchBot",
  initialMessages: [
    createChatBotMessage(
      `Good morning, ${localStorage.getItem(
        "username"
      )}! What information would you like me to fetch?`,
      {
        widget: "typeOptions",
      }
    ),
  ],
  customComponents: {
    // Replaces the default header in the chatbot
   
  
  },

  state: {
    selectedType: "",
    selectedPeriod: "",
    
  },

  widgets: [
    {
      widgetName: "typeOptions",
      widgetFunc: (props) => <TypeOptions {...props} />,
      mapStateToProps: ["selectedType"],
    },
    {
      widgetName: "periodOptions",
      widgetFunc: (props) => <PeriodOptions {...props} />,
      mapStateToProps: ["selectedPeriod"],
    },
    {
      widgetName: "dataWidget",
      widgetFunc: (props) => <DataWidget {...props} />,
      mapStateToProps: ["selectedType", "selectedPeriod"],
    },
    {
        widgetName: "askMoreWidget",
        widgetFunc: (props) => <AskMoreWidget {...props} />,
        mapStateToProps: ["selectedType", "selectedPeriod"],
    }
  ],
};

export default config;
