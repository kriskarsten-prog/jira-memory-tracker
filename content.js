const STORAGE_KEY = "jiraIssues";

function getText(selector) {
  return document.querySelector(selector)?.textContent.trim() || null;
}

function getIssueKey() {
  return getText('[data-test-id*="breadcrumb-current-issue"]');
}

function getStatus() {
  return getText('[data-test-id="issue.views.field.value.status"]');
}

function getEffort() {
  const labels = [...document.querySelectorAll('[data-test-id="issue.views.field.label"]')];
  const effortLabel = labels.find(l =>
    /story points|effort|estimate/i.test(l.textContent)
  );
  if (!effortLabel) return null;

  return effortLabel
    .closest('[data-test-id="issue.views.field"]')
    ?.querySelector('[data-test-id="issue.views.field.value"]')
    ?.textContent.trim();
}

function saveIssue(issue) {
  chrome.storage.local.get({ [STORAGE_KEY]: {} }, (data) => {
    const issues = data[STORAGE_KEY];
    issues[issue.key] = {
      ...(issues[issue.key] || {}),
      ...issue,
      lastViewed: new Date().toISOString()
    };
    chrome.storage.local.set({ [STORAGE_KEY]: issues });
  });
}

function injectNotesUI(issueKey) {
  if (document.getElementById("jira-memory-notes")) return;

  const panel = document.createElement("div");
  panel.id = "jira-memory-notes";
  panel.style.cssText = `
    position: fixed;
    right: 12px;
    bottom: 12px;
    width: 260px;
    background: #fff;
    border: 1px solid #ccc;
    padding: 8px;
    z-index: 9999;
    font-size: 12px;
  `;

  panel.innerHTML = `
    <strong>Private Notes</strong>
    <textarea id="private-note" rows="3" style="width:100%"></textarea>
    <strong>Checklist Notes</strong>
    <textarea id="checklist-note" rows="3" style="width:100%"></textarea>
    <button id="save-note">Save</button>
  `;

  document.body.appendChild(panel);

  document.getElementById("save-note").onclick = () => {
    chrome.storage.local.get({ [STORAGE_KEY]: {} }, (data) => {
      const issues = data[STORAGE_KEY];
      const issue = issues[issueKey] || {};

      issue.notes = issue.notes || { private: "", checklist: {} };
      issue.notes.private = document.getElementById("private-note").value;

      const checklistText = document.getElementById("checklist-note").value;
      if (checklistText) {
        issue.notes.checklist["General"] = checklistText;
      }

      issues[issueKey] = issue;
      chrome.storage.local.set({ [STORAGE_KEY]: issues });
    });
  };
}

function scan() {
  const key = getIssueKey();
  if (!key) return;

  saveIssue({
    key,
    status: getStatus(),
    effort: getEffort(),
    url: location.href
  });

  injectNotesUI(key);
}

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(scan, 800);
  }
}).observe(document.body, { childList: true, subtree: true });

setTimeout(scan, 1200);
