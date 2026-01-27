function getStorage() {
  if (chrome && chrome.storage && chrome.storage.local) return "chrome";
  return "local";
}

function saveTicket(ticketKey, ticketData) {
  if (getStorage() === "chrome") {
    chrome.storage.local.set({ [ticketKey]: ticketData });
  } else {
    localStorage.setItem(ticketKey, JSON.stringify(ticketData));
  }
}

// Extract ticket data from Jira page
const ticketKey = document.querySelector("#key-val")?.innerText || "UNKNOWN";
const status = document.querySelector("[data-test-id='issue.views.issue-base.foundation.status.status-field']")?.innerText || "UNKNOWN";
const assignee = document.querySelector("[data-test-id='issue.views.issue-base.foundation.assignee.assignee-field']")?.innerText || "UNKNOWN";
const reporter = document.querySelector("[data-test-id='issue.views.issue-base.foundation.reporter.reporter-field']")?.innerText || "UNKNOWN";

const ticketData = {
  ticketKey,
  status,
  assignee,
  reporter,
  lastUpdated: new Date().toISOString(),
  note: ""
};

saveTicket(ticketKey, ticketData);
