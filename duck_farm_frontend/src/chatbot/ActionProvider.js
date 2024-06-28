class ActionProvider {
  constructor(createChatBotMessage, setState, createClientMessage, stateRef) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setState;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
  }

  handleTypeSelection = (type, text) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedType: type,
    }));

    const userMessage = this.createClientMessage(`${text}`);
    this.addMessageToState(userMessage);

    const botMessage = this.createChatBotMessage("Please select a period:", {
      widget: "periodOptions",
    });
    this.addMessageToState(botMessage);
  };

  handlePeriodSelection = (period, text) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedPeriod: period,
    }));

    const userMessage = this.createClientMessage(`${text}`);
    this.addMessageToState(userMessage);

    const botMessage = this.createChatBotMessage("Fetching data...", {
      widget: "dataWidget",
    });
    this.addMessageToState(botMessage);
  };

  handleFetchDataSuccess = (data) => {
    const message = this.createChatBotMessage(` ${data.data}`);
    this.addMessageToState(message);
    const askMoreMessage = this.createChatBotMessage(
      "Do you want to ask more questions?",
      {
        widget: "askMoreWidget",
      }
    );
    this.addMessageToState(askMoreMessage);
  };

  handleFetchDataError = () => {
    const message = this.createChatBotMessage("Failed to fetch data");
    this.addMessageToState(message);
    const askMoreMessage = this.createChatBotMessage(
      "Do you want to ask more questions?",
      {
        widget: "askMoreWidget",
      }
    );
    this.addMessageToState(askMoreMessage);
  };
  handleAskMoreQuestions = () => {
    const restartMessage = this.createChatBotMessage(
      `What information would you like me to fetch?`,
      {
        widget: "typeOptions",
      }
    );
    this.addMessageToState(restartMessage);
  };



  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;
