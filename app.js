let tasks = [];
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const activeTasksEl = document.getElementById("activeTasks");

function addTask(text) {
  const task = {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter(t => !t.completed);
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  return tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = filteredTasks.map(task => `
    <li class="task-item ${task.completed ? "completed" : ""}">
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} 
               onclick="toggleComplete(${task.id})" />
        <span>${task.text}</span>
      </div>
      <button onclick="deleteTask(${task.id})">❌</button>
    </li>
  `).join("");

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  activeTasksEl.textContent = active;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks"));
  if (saved) tasks = saved;
}

taskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
});

document.querySelectorAll(".filters button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
});
