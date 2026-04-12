const dueDate = new Date("2026-05-01T18:00:00Z");
const timeEl  = document.getElementById("time-remaining");
const checkbox = document.getElementById("checkbox");
const status  = document.getElementById("status");
const card    = document.querySelector('[data-testid="test-todo-card"]');

function updateTime() {
  const diff    = dueDate - new Date();
  const minutes = Math.floor(Math.abs(diff) / (1000 * 60));
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  let label = "";
  let cls   = "";

  if (diff <= 0) {
    if (days > 0)        label = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
    else if (hours > 0)  label = `Overdue by ${hours} hr${hours > 1 ? "s" : ""}`;
    else                 label = `Overdue by ${minutes} min${minutes > 1 ? "s" : ""}`;
    cls = "overdue";
  } else if (days > 1)   label = `Due in ${days} days`;
  else if (days === 1)   label = "Due tomorrow";
  else if (hours > 0)  { label = `Due in ${hours} hr${hours > 1 ? "s" : ""}`; cls = "soon"; }
  else if (minutes > 0){ label = `Due in ${minutes} min${minutes > 1 ? "s" : ""}`; cls = "soon"; }
  else                 { label = "Due now!"; cls = "soon"; }

  timeEl.textContent = label;
  timeEl.className   = cls;
  timeEl.setAttribute("aria-label", `Time remaining: ${label}`);
}

updateTime();
setInterval(updateTime, 60000);

checkbox.addEventListener("change", () => {
  const done = checkbox.checked;
  card.classList.toggle("completed", done);
  status.textContent = done ? "Done" : "Pending";
});

document.querySelector('[data-testid="test-todo-edit-button"]')
  .addEventListener("click", () => console.log("edit clicked"));

document.querySelector('[data-testid="test-todo-delete-button"]')
  .addEventListener("click", () => alert("Delete clicked"));