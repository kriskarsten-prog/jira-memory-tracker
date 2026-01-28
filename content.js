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
