chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "EXPORT_CSV") {
    chrome.storage.local.get(null, (items) => {
      const headers = [
        "Ticket",
        "Status",
        "Assignee",
        "Reporter",
        "Last Updated",
        "Private Note"
      ];

      const rows = Object.values(items).map(t =>
        [
          t.ticketKey,
          t.status,
          t.assignee,
          t.reporter,
          t.lastUpdated,
          `"${t.note || ""}"`
        ].join(",")
      );

      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url,
        filename: "jira_ticket_tracker.csv"
      });
    });
  }
});