const eventBus = {
    // Subscribe to an event
    on(event, callback) {
      console.log(`Subscribing to event: ${event}`);
      document.addEventListener(event, (e) => {
        console.log(`Event received: ${event}`, e.detail);
        callback(e.detail);
      });
    },
  
    // Publish (dispatch) an event with data
    dispatch(event, data) {
      console.log(`Dispatching event: ${event}`, data);
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
  
    // Unsubscribe from an event
    remove(event, callback) {
      console.log(`Removing listener for event: ${event}`);
      document.removeEventListener(event, callback);
    },
  };
  
  export default eventBus;
  