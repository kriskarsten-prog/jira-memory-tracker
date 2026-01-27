document.addEventListener("DOMContentLoaded", async () => {
  const ticketList = document.getElementById("ticketList");
  const tickets = await getAllTickets();

  ticketList.innerHTML = "";

  if (Object.keys(tickets).length === 0) {
    ticketList.innerHTML = "No tickets tracked yet. Open a Jira ticket first.";
  }

  Object.values(tickets).forEach((t) => {
    const div = document.createElement("div");
    div.className = "ticket";

    div.innerHTML = `
      <strong>${t.ticketKey}</strong> (${t.status})<br>
      Assignee: ${t.assignee}<br>
      Reporter: ${t.reporter}<br>
      Last Updated: ${t.lastUpdated}<br>
      <textarea placeholder="Add note...">${t.note || ""}</textarea>
    `;

    const textarea = div.querySelector("textarea");
    textarea.addEventListener("change", () => {
      t.note = textarea.value;
      saveTicketData(t.ticketKey, t);
    });

    ticketList.appendChild(div);
  });

  document.getElementById("exportBtn").addEventListener("click", async () => {
    const allTickets = await getAllTickets();
    const headers = ["Ticket", "Status", "Assignee", "Reporter", "Last Updated", "Note"];
    const rows = Object.values(allTickets).map(t =>
      [t.ticketKey, t.status, t.assignee, t.reporter, t.lastUpdated, `"${t.note || ""}"`].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    // Cross-browser download
    if (chrome && chrome.downloads) {
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({ url, filename: `jira_ticket_tracker_${new Date().toISOString().slice(0,10)}.csv` });
    } else {
      // Island / fallback
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `jira_ticket_tracker_${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
    }
  });
});
