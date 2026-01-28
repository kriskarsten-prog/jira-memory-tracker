const STORAGE_KEY = "jiraIssues";
const container = document.getElementById("issues");

chrome.storage.local.get({ [STORAGE_KEY]: {} }, (data) => {
  const issues = Object.values(data[STORAGE_KEY])
    .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
    .slice(0, 10);

  if (!issues.length) {
    container.textContent = "No issues tracked yet.";
    return;
  }

  issues.forEach(issue => {
    const div = document.createElement("div");
    div.className = "issue";

    div.innerHTML = `
      <strong>${issue.key}</strong>
      <div>Status: ${issue.status || "—"}</div>
      <div>Effort: ${issue.effort || "—"}</div>
      <div class="note">${issue.notes?.private || ""}</div>
    `;

    container.appendChild(div);
  });
});
