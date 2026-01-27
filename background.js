chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SAVE_TICKET") {
    const ticket = message.payload;
    chrome.storage.local.set({ [ticket.key]: ticket });
  }
});
