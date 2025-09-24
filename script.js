// DOM Elements
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const tabs = document.getElementById("tabs");

// Load from LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let currentCategory = Object.keys(tasks)[0] || null;

if (!currentCategory) {
  addCategory("Work"); // default category
}

// Add Category
function addCategory(name = null) {
  const categoryInput = document.getElementById("categoryInput");
  const categoryName = name || categoryInput.value.trim();

  if (categoryName === "") return alert("Enter category name!");

  if (!tasks[categoryName]) {
    tasks[categoryName] = [];
    saveTasks();
  }

  categoryInput.value = "";
  currentCategory = categoryName;
  renderTabs();
  renderTasks();
}

// Switch Category
function switchCategory(category) {
  currentCategory = category;
  renderTabs();
  renderTasks();
}

// Render Tabs
function renderTabs() {
  tabs.innerHTML = "";
  Object.keys(tasks).forEach(category => {
    const btn = document.createElement("button");
    btn.className = "tab" + (category === currentCategory ? " active" : "");
    btn.innerText = category;
    btn.onclick = () => switchCategory(category);
    tabs.appendChild(btn);
  });
}

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return alert("Please enter a task!");

  const task = { text: taskText, completed: false };
  tasks[currentCategory].push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// Toggle Complete
function toggleComplete(index) {
  tasks[currentCategory][index].completed = !tasks[currentCategory][index].completed;
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(index) {
  tasks[currentCategory].splice(index, 1);
  saveTasks();
  renderTasks();
}

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks[currentCategory].forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="complete" onclick="toggleComplete(${index})">✔</button>
        <button class="delete" onclick="deleteTask(${index})">✖</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateProgress();
}

// Update Progress
function updateProgress() {
  const total = tasks[currentCategory].length;
  const completed = tasks[currentCategory].filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progress.style.width = percent + "%";
  progressText.innerText = `${percent}% Completed`;
}

// Initial Render
renderTabs();
renderTasks();
