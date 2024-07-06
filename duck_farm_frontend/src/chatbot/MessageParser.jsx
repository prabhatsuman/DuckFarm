class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      return this.actionProvider.handleMessageParser(message);
  }
}
  
  export default MessageParser;
  