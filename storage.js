// Save ticket data (called from popup if editing note)
function saveTicketData(ticketKey, ticketData) {
  if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ [ticketKey]: ticketData });
  } else {
    localStorage.setItem(ticketKey, JSON.stringify(ticketData));
  }
}

// Get all tickets
function getAllTickets() {
  return new Promise((resolve) => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(null, (items) => resolve(items));
    } else {
      const items = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          items[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          continue;
        }
      }
      resolve(items);
    }
  });
}
