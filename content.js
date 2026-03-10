// content.js - Runs on Jira ticket pages, extracts ticket info and sends to storage

function extractJiraTicketData() {
  const data = {};

  // Extract ticket ID from URL
  const urlMatch = window.location.pathname.match(/\/browse\/([A-Z]+-\d+)/i)
    || window.location.pathname.match(/\/([A-Z]+-\d+)/i);
  if (urlMatch) {
    data.ticketId = urlMatch[1].toUpperCase();
  } else {
    return null; // Not a ticket page
  }

  data.url = window.location.href;
  data.lastVisited = Date.now();

  // --- Title / Summary ---
  const titleSelectors = [
    'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]',
    'h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]',
    '#summary-val',
    'h1.js-issue-title',
    '[data-testid="issue-title"]',
    'h1'
  ];
  for (const sel of titleSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      data.title = el.textContent.trim();
      break;
    }
  }

  // --- Status ---
  const statusSelectors = [
    '[data-testid="issue.fields.status"] button',
    '[data-testid="issue.fields.status"] span',
    '#status-val',
    '.status-view',
    '[data-test-id*="status"] span',
    'span[class*="status"]'
  ];
  for (const sel of statusSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      data.status = el.textContent.trim();
      break;
    }
  }

  // --- Assignee ---
  const assigneeSelectors = [
    '[data-testid="issue.fields.assignee"] a',
    '[data-testid="issue.fields.assignee"] span[aria-label]',
    '#assignee-val',
    '[data-field-id="assignee"] a'
  ];
  for (const sel of assigneeSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      data.assignee = el.textContent.trim();
      break;
    }
  }

  // --- Priority ---
  const prioritySelectors = [
    '[data-testid="issue.fields.priority"] img',
    '#priority-val img',
    '[data-field-id="priority"] img'
  ];
  for (const sel of prioritySelectors) {
    const el = document.querySelector(sel);
    if (el) {
      data.priority = el.alt || el.title || '';
      break;
    }
  }

  // --- Story points / estimate ---
  const storyPointSelectors = [
    '[data-testid="issue.fields.story-points"] span',
    '#customfield_10016-val',
    '[data-field-id="story_points"]',
    '[data-testid*="story-point"]'
  ];
  for (const sel of storyPointSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      data.storyPoints = el.textContent.trim();
      break;
    }
  }

  // --- Reporter ---
  const reporterSelectors = [
    '[data-testid="issue.fields.reporter"] a',
    '#reporter-val',
    '[data-field-id="reporter"] a'
  ];
  for (const sel of reporterSelectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) {
      data.reporter = el.textContent.trim();
      break;
    }
  }

  return data;
}

function saveTicketData(ticketData) {
  const key = `ticket_${ticketData.ticketId}`;
  chrome.storage.local.get([key], (result) => {
    const existing = result[key] || {};
    // Merge: preserve user notes and progress, update ticket info
    const merged = {
      ...existing,
      ...ticketData,
      notes: existing.notes || '',
      progress: existing.progress || 'not-started',
      lastVisited: Date.now()
    };
    chrome.storage.local.set({ [key]: merged });

    // Also update the "recent" list
    chrome.storage.local.get(['recentTickets'], (r) => {
      let recent = r.recentTickets || [];
      recent = recent.filter(id => id !== ticketData.ticketId);
      recent.unshift(ticketData.ticketId);
      recent = recent.slice(0, 20); // keep last 20
      chrome.storage.local.set({ recentTickets: recent });
    });
  });
}

// Run extraction once DOM is ready
function tryExtract() {
  const data = extractJiraTicketData();
  if (data && data.title) {
    saveTicketData(data);
  }
}

// Try immediately, then again after a delay (Jira is an SPA and loads async)
tryExtract();
setTimeout(tryExtract, 2000);
setTimeout(tryExtract, 5000);

// Also watch for SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(tryExtract, 1500);
    setTimeout(tryExtract, 4000);
  }
}).observe(document, { subtree: true, childList: true });
