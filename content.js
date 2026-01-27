function waitForTicket() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const keyEl = document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]')
        || document.querySelector('[href*="/browse/"]');

      if (keyEl) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}

function getText(selector) {
  const el = document.querySelector(selector);
  return el ? el.innerText.trim() : "UNKNOWN";
}

async function captureTicket() {
  await waitForTicket();

  const ticketKey =
    getText('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]') ||
    window.location.pathname.split("/").pop();

  const ticket = {
    key: ticketKey,
    status: getText('[data-testid="issue.views.issue-base.foundation.status.status-field"]'),
    assignee: getText('[data-testid="issue.views.issue-base.foundation.assignee.assignee-field"]'),
    reporter: getText('[data-testid="issue.views.issue-base.foundation.reporter.reporter-field"]'),
    lastViewed: new Date().toISOString(),
    note: ""
  };

  if (ticket.key) {
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: "SAVE_TICKET", payload: ticket });
    } else {
      localStorage.setItem(ticket.key, JSON.stringify(ticket));
    }

    console.log("Jira Memory Tracker saved:", ticket);
  }
}

captureTicket();
