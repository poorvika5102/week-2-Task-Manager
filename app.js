// ===============================
// GLOBAL STATE
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ===============================
// DOM ELEMENTS
// ===============================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const activeTasksEl = document.getElementById("activeTasks");

const filterButtons = document.querySelectorAll(".sidebar nav button");
const themeToggle = document.getElementById("themeToggle");

// ===============================
// ADD TASK
// ===============================

function addTask(text) {
  if (!text.trim()) return;

  const task = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskForm.reset();
}

// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ===============================
// TOGGLE COMPLETE
// ===============================

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

// ===============================
// FILTER TASKS
// ===============================

function getFilteredTasks() {
  switch (currentFilter) {
    case "active":
      return tasks.filter(task => !task.completed);
    case "completed":
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
}

// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = filteredTasks.map(task => `
    <div class="task-card ${task.priority} ${task.completed ? "completed" : ""}" data-id="${task.id}">
      
      <div class="task-info">
        <strong>${task.text}</strong>
        <div class="task-meta">
          Priority: ${task.priority.toUpperCase()} |
          Due: ${task.dueDate || "No date"}
        </div>
      </div>

      <div class="task-actions">
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <button class="delete-btn">🗑</button>
      </div>

    </div>
  `).join("");

  updateStats();
}

// ===============================
// UPDATE STATISTICS
// ===============================

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  activeTasksEl.textContent = active;
}

// ===============================
// LOCAL STORAGE
// ===============================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===============================
// EVENT LISTENERS
// ===============================

// Add Task
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTask(taskInput.value);
});

// Event Delegation for Tasks
taskList.addEventListener("click", function (e) {
  const card = e.target.closest(".task-card");
  if (!card) return;

  const id = Number(card.dataset.id);

  if (e.target.matches("input[type='checkbox']")) {
    toggleComplete(id);
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteTask(id);
  }
});

// Filter Buttons
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".sidebar nav .active")
      .classList.remove("active");

    button.classList.add("active");
    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  themeToggle.textContent = isDark
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
});

// ===============================
// INITIAL LOAD
// ===============================

window.addEventListener("DOMContentLoaded", () => {
  renderTasks();

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀ Light Mode";
  }
});

