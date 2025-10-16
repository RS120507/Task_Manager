// Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDate");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");
const toggleMode = document.getElementById("toggleMode");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const overdueTasksEl = document.getElementById("overdueTasks");

// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Add task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (taskText) {
    const task = {
      id: Date.now(),
      text: taskText,
      category,
      priority,
      dueDate,
      completed: false
    };
    tasks.push(task);
    saveAndRender();
    taskInput.value = "";
    dueDateInput.value = "";
  }
});

// Toggle dark mode
toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Filter & search
searchInput.addEventListener("input", renderTasks);
filterCategory.addEventListener("change", renderTasks);
filterPriority.addEventListener("change", renderTasks);

// Save to localStorage
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Render tasks
function renderTasks() {
  const search = searchInput.value.toLowerCase();
  const categoryFilter = filterCategory.value;
  const priorityFilter = filterPriority.value;

  taskList.innerHTML = "";

  let completed = 0;
  let overdue = 0;

  tasks
    .filter(task => task.text.toLowerCase().includes(search))
    .filter(task => categoryFilter === "All" || task.category === categoryFilter)
    .filter(task => priorityFilter === "All" || task.priority === priorityFilter)
    .sort((a,b) => a.id - b.id)
    .forEach(task => {
      const li = document.createElement("li");
      li.className = `task-item priority-${task.priority}`;
      if(task.completed) li.classList.add("completed");

      const due = new Date(task.dueDate);
      const now = new Date();
      if(dueDateInput.value && !task.completed && due < now) {
        li.style.borderLeftColor = "red";
        overdue++;
      }

      li.innerHTML = `
        <div>
          <strong>${task.text}</strong><br>
          <small>${task.category} | ${task.priority} | Due: ${task.dueDate || "N/A"}</small>
        </div>
        <div>
          <button class="complete-btn">${task.completed ? "Undo" : "Done"}</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // Complete toggle
      li.querySelector(".complete-btn").addEventListener("click", () => {
        task.completed = !task.completed;
        saveAndRender();
      });

      // Delete
      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveAndRender();
      });

      taskList.appendChild(li);
      if(task.completed) completed++;
    });

  // Dashboard
  totalTasksEl.textContent = tasks.length;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = tasks.length - completed;
  overdueTasksEl.textContent = overdue;
}
