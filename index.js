// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  title: "Finish Frontend Task",
  description:
    "Build a fully accessible and responsive todo card component that meets all the requirements of the Frontend Wizards challenge. This includes editing, status transitions, priority changes, expand/collapse behavior, and dynamic time handling.",
  priority: "High",
  status: "Pending",
  dueDate: new Date("2026-05-01T18:00:00Z"),
  done: false,
};

// Snapshot for cancel
let editSnapshot = null;

// ─── Element refs ─────────────────────────────────────────────────────────────
const card          = document.querySelector('[data-testid="test-todo-card"]');
const titleEl       = document.querySelector('[data-testid="test-todo-title"]');
const descEl        = document.querySelector('[data-testid="test-todo-description"]');
const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
const priorityInd   = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const statusText    = document.getElementById("status");
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const checkbox      = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const timeEl        = document.getElementById("time-remaining");
const dueDateEl     = document.getElementById("due-date-display");
const overdueInd    = document.querySelector('[data-testid="test-todo-overdue-indicator"]');

const editButton    = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton  = document.querySelector('[data-testid="test-todo-delete-button"]');
const editForm      = document.querySelector('[data-testid="test-todo-edit-form"]');
const saveButton    = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelButton  = document.querySelector('[data-testid="test-todo-cancel-button"]');

const editTitleInput    = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescInput     = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPrioritySelect= document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDateInput  = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');

const expandToggle   = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsible    = document.querySelector('[data-testid="test-todo-collapsible-section"]');

const COLLAPSE_THRESHOLD = 120; // chars

// ─── Time ─────────────────────────────────────────────────────────────────────
function updateTime() {
  if (state.done) {
    timeEl.textContent = "Completed";
    timeEl.className = "";
    timeEl.setAttribute("aria-label", "Task completed");
    overdueInd.hidden = true;
    card.classList.remove("overdue");
    return;
  }

  const diff = state.dueDate - new Date();
  const absDiff = Math.abs(diff);
  const totalMinutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const days  = Math.floor(hours / 24);
  const remHours = hours % 24;
  const remMinutes = totalMinutes % 60;

  let label = "";
  let cls   = "";

  if (diff <= 0) {
    // Overdue
    if (days > 0)          label = `Overdue by ${days} day${days !== 1 ? "s" : ""}`;
    else if (hours > 0)    label = `Overdue by ${hours} hr${hours !== 1 ? "s" : ""}`;
    else if (totalMinutes > 0) label = `Overdue by ${totalMinutes} min${totalMinutes !== 1 ? "s" : ""}`;
    else                   label = "Just overdue";
    cls = "overdue";
    overdueInd.hidden = false;
    card.classList.add("overdue");
  } else {
    overdueInd.hidden = true;
    card.classList.remove("overdue");

    if (days > 1)             label = `Due in ${days} days`;
    else if (days === 1)      label = "Due tomorrow";
    else if (hours > 0 && remMinutes > 0)
      label = `Due in ${hours} hr${hours !== 1 ? "s" : ""} ${remMinutes} min`;
    else if (hours > 0)       label = `Due in ${hours} hr${hours !== 1 ? "s" : ""}`;
    else if (totalMinutes > 0) label = `Due in ${totalMinutes} min${totalMinutes !== 1 ? "s" : ""}`;
    else                      label = "Due now!";

    cls = (diff < 1000 * 60 * 60 * 24) ? "soon" : "";
  }

  timeEl.textContent = label;
  timeEl.className   = cls;
  timeEl.setAttribute("aria-label", `Time remaining: ${label}`);
}

updateTime();
setInterval(updateTime, 30000);

// ─── Render state to DOM ──────────────────────────────────────────────────────
function applyState() {
  // Title
  titleEl.textContent = state.title;

  // Description
  descEl.textContent = state.description;
  setupExpandCollapse();

  // Priority badge
  const priorityClasses = { High: "high", Medium: "medium", Low: "low" };
  priorityBadge.className = `badge ${priorityClasses[state.priority] || "high"}`;
  priorityBadge.textContent = state.priority;
  priorityBadge.setAttribute("aria-label", `${state.priority} priority`);

  // Priority indicator (top bar)
  card.setAttribute("data-priority", state.priority);

  // Status
  statusText.textContent = state.status;
  statusControl.value = state.status;
  updateStatusSelectStyle();

  // Done / checkbox sync
  checkbox.checked = state.done;
  card.classList.toggle("completed", state.done);

  // Due date display
  dueDateEl.textContent = `Due ${state.dueDate.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })}`;
  dueDateEl.setAttribute("datetime", state.dueDate.toISOString());

  // Time
  updateTime();
}

function updateStatusSelectStyle() {
  statusControl.classList.remove("status-done", "status-inprogress");
  if (state.status === "Done")        statusControl.classList.add("status-done");
  if (state.status === "In Progress") statusControl.classList.add("status-inprogress");
}

// ─── Expand / collapse ────────────────────────────────────────────────────────
function setupExpandCollapse() {
  const isLong = state.description.length > COLLAPSE_THRESHOLD;
  expandToggle.hidden = !isLong;

  if (!isLong) {
    collapsible.classList.remove("collapsed");
    expandToggle.setAttribute("aria-expanded", "true");
    return;
  }

  const expanded = expandToggle.getAttribute("aria-expanded") === "true";
  collapsible.classList.toggle("collapsed", !expanded);
  expandToggle.textContent = expanded ? "Show less" : "Show more";
}

expandToggle.addEventListener("click", () => {
  const expanded = expandToggle.getAttribute("aria-expanded") === "true";
  expandToggle.setAttribute("aria-expanded", String(!expanded));
  collapsible.classList.toggle("collapsed", expanded);
  expandToggle.textContent = !expanded ? "Show less" : "Show more";
});

// Initial collapsed setup
if (state.description.length > COLLAPSE_THRESHOLD) {
  expandToggle.hidden = false;
  expandToggle.setAttribute("aria-expanded", "false");
  collapsible.classList.add("collapsed");
  expandToggle.textContent = "Show more";
}

// ─── Checkbox ────────────────────────────────────────────────────────────────
checkbox.addEventListener("change", () => {
  state.done = checkbox.checked;
  state.status = state.done ? "Done" : "Pending";
  applyState();
});

// ─── Status control ───────────────────────────────────────────────────────────
statusControl.addEventListener("change", () => {
  state.status = statusControl.value;
  state.done   = state.status === "Done";
  applyState();
});

// ─── Edit mode ────────────────────────────────────────────────────────────────
function toLocalDatetimeValue(date) {
  // Convert to local ISO string for datetime-local input
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function openEditMode() {
  // Snapshot current values for cancel
  editSnapshot = { ...state, dueDate: new Date(state.dueDate) };

  // Populate form
  editTitleInput.value     = state.title;
  editDescInput.value      = state.description;
  editPrioritySelect.value = state.priority;
  editDueDateInput.value   = toLocalDatetimeValue(state.dueDate);

  // Show form, hide edit button, show save/cancel
  editForm.hidden = false;
  editButton.hidden = true;
  saveButton.hidden = false;
  cancelButton.hidden = false;

  // Focus first field
  editTitleInput.focus();
}

function closeEditMode(save) {
  if (!save && editSnapshot) {
    // Restore snapshot
    Object.assign(state, editSnapshot);
    state.dueDate = new Date(editSnapshot.dueDate);
  }

  // Hide buttons explicitly
  saveButton.hidden = true;
  cancelButton.hidden = true;
  editForm.hidden = true;
  editButton.hidden = false;
  applyState();

  // Return focus to edit button
  editButton.focus();
}

editButton.addEventListener("click", openEditMode);

saveButton.addEventListener("click", () => {
  const newTitle = editTitleInput.value.trim();
  const newDesc  = editDescInput.value.trim();

  if (!newTitle) {
    editTitleInput.focus();
    editTitleInput.style.borderColor = "rgba(192,57,43,0.5)";
    return;
  }
  editTitleInput.style.borderColor = "";

  state.title       = newTitle;
  state.description = newDesc;
  state.priority    = editPrioritySelect.value;

  if (editDueDateInput.value) {
    state.dueDate = new Date(editDueDateInput.value);
  }

  closeEditMode(true);
});

cancelButton.addEventListener("click", () => closeEditMode(false));

// Trap focus inside edit form
editForm.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusable = Array.from(
    editForm.querySelectorAll(
      'input, textarea, select, button:not([hidden])'
    )
  ).filter((el) => !el.disabled && !el.hidden);
  if (!focusable.length) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

// ─── Delete ───────────────────────────────────────────────────────────────────
deleteButton.addEventListener("click", () => {
  card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  card.style.opacity    = "0";
  card.style.transform  = "scale(0.96)";
  setTimeout(() => card.remove(), 300);
});

// ─── Initial render ───────────────────────────────────────────────────────────
applyState();