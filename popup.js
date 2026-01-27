async function render() {
  const container = document.getElementById("tickets");
  const tickets = await Storage.getAll();

  container.innerHTML = "";

  const values = Object.values(tickets);

  if (!values.length) {
    container.innerText = "Open a Jira ticket to start tracking.";
    return;
  }

  values.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket";

    div.innerHTML = `
      <strong>${ticket.key}</strong><br/>
      Status: ${ticket.status}<br/>
      Assignee: ${ticket.assignee}<br/>
      <textarea placeholder="Add context…">${ticket.note || ""}</textarea>
    `;

    const textarea = div.querySelector("textarea");
    textarea.addEventListener("change", () => {
      ticket.note = textarea.value;
      Storage.set(ticket.key, ticket);
    });

    container.appendChild(div);
  });
}

document.getElementById("export").addEventListener("click", async () => {
  const tickets = Object.values(await Storage.getAll());
  if (!tickets.length) return;

  const header = ["Key", "Status", "Assignee", "Reporter", "Last Viewed", "Note"];
  const rows = tickets.map(t =>
    [t.key, t.status, t.assignee, t.reporter, t.lastViewed, `"${t.note || ""}"`].join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `jira_memory_tracker_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
});

render();
