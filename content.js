// Example selectors
const issueKey = document.querySelector('[data-test-id="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue.ellipsis"]')?.textContent;
const summary = document.querySelector('[data-test-id="issue.views.field.value.summary"]')?.textContent;
const status = document.querySelector('[data-test-id="issue.views.field.value.status"]')?.textContent;

if (issueKey) {
  chrome.storage.local.get({ issues: {} }, (data) => {
    const issues = data.issues;
    issues[issueKey] = {
      key: issueKey,
      summary,
      status,
      lastViewed: new Date().toISOString()
    };
    chrome.storage.local.set({ issues });
  });
}
function injectNotesUI(issueKey) {
  if (document.getElementById("jira-memory-notes")) return;

  const container = document.createElement("div");
  container.id = "jira-memory-notes";
  container.style.cssText = `
    position: fixed;
    right: 16px;
    bottom: 16px;
    width: 280px;
    background: white;
    border: 1px solid #ddd;
    padding: 10px;
    z-index: 9999;
    font-size: 12px;
  `;

  container.innerHTML = `
    <strong>My Notes</strong>
    <textarea id="jira-private-note" rows="3" placeholder="Private notes..."></textarea>
    <strong>Checklist Notes</strong>
    <textarea id="jira-checklist-note" rows="3" placeholder="Relates to checklist item..."></textarea>
    <button id="save-jira-note">Save</button>
  `;

  document.body.appendChild(container);

  document.getElementById("save-jira-note").onclick = () => {
    saveNotes(issueKey);
  };
}

