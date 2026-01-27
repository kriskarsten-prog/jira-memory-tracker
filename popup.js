document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tickets");

  function loadTickets() {
    container.innerHTML = "";

    const keys = Object.keys(localStorage).filter(k => k.startsWith("jira_"));

    if (!keys.length) {
      container.innerText = "Open a Jira ticket to start tracking.";
      return;
    }

    keys.forEach(key => {
      const ticket = JSON.parse(localStorage.getItem(key));
      const div = document.createElement("div");
      div.className = "ticket";

      div.innerHTML = `
        <strong>${ticket.key}</strong><br>
        Status: ${ticket.status}<br>
        Assignee: ${ticket.assignee}<br>
        <textarea>${ticket.note || ""}</textarea>
      `;

      const textarea = div.querySelector("textarea");
      textarea.addEventListener("change", () => {
        ticket.note = textarea.value;
        localStorage.setItem(key, JSON.stringify(ticket));
      });

      container.appendChild(div);
    });
  }

  document.getElementById("export").addEventListener("click", () => {
    const tickets = Object.keys(localStorage)
      .filter(k => k.startsWith("jira_"))
      .map(k => JSON.parse(localStorage.getItem(k)));

    if (!tickets.length) return;

    const csv = [
      ["Key", "Status", "Assignee", "Reporter", "Last Viewed", "Note"].join(","),
      ...tickets.map(t =>
        [t.key, t.status, t.assignee, t.reporter, t.lastViewed, `"${t.note || ""}"`].join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "jira_memory_tracker.csv";
    link.click();
  });

  loadTickets();
});
