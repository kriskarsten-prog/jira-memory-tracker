(function () {
  console.log("Jira Memory Tracker: content script loaded");

  function waitForJira() {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (document.body && location.pathname.includes("/browse/")) {
          clearInterval(check);
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
    await waitForJira();

    const ticketKey = location.pathname.split("/browse/")[1];
    if (!ticketKey) return;

    const ticket = {
      key: ticketKey,
      status: getText('[data-testid*="status"]'),
      assignee: getText('[data-testid*="assignee"]'),
      reporter: getText('[data-testid*="reporter"]'),
      lastViewed: new Date().toISOString(),
      note: ""
    };

    try {
      localStorage.setItem(`jira_${ticketKey}`, JSON.stringify(ticket));
      console.log("Jira Memory Tracker saved:", ticket);
    } catch (e) {
      console.error("Storage failed", e);
    }
  }

  captureTicket();
})();
