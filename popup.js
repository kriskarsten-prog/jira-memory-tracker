const container = document.getElementById("tickets");

chrome.storage.local.get(null, (items) => {
  Object.values(items).forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket";

    div.innerHTML = `
      <div class="status">${ticket.ticketKey} — ${ticket.status}</div>
      <div>Assignee: ${ticket.assignee}</div>
      <div>Reporter: ${ticket.reporter}</div>
      <small>Last viewed: ${new Date(ticket.lastUpdated).toLocaleString()}</small>
      <textarea placeholder="Private note...">${ticket.note || ""}</textarea>
    `;

    const textarea = div.querySelector("textarea");
    textarea.addEventListener("input", () => {
      chrome.storage.local.set({
        [ticket.ticketKey]: { ...ticket, note: textarea.value }
      });
    });

    container.appendChild(div);
  });
});

document.getElementById("export").onclick = () => {
  chrome.runtime.sendMessage({ type: "EXPORT_CSV" });
};