function scrapeTicket() {
  const ticketKey = document.querySelector(
    '[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue"]'
  )?.innerText;

  const status = document.querySelector(
    '[data-testid="issue.fields.status.common.ui.status-lozenge"]'
  )?.innerText;

  const assignee = document.querySelector(
    '[data-testid="issue.fields.assignee.common.ui.user-name"]'
  )?.innerText || "Unassigned";

  const reporter = document.querySelector(
    '[data-testid="issue.fields.reporter.common.ui.user-name"]'
  )?.innerText || "Unknown";

  if (!ticketKey) return;

  chrome.storage.local.get([ticketKey], (existing) => {
    const previous = existing[ticketKey] || {};

    chrome.storage.local.set({
      [ticketKey]: {
        ticketKey,
        status,
        assignee,
        reporter,
        lastUpdated: new Date().toISOString(),
        note: previous.note || ""
      }
    });
  });
}

setTimeout(scrapeTicket, 3000);