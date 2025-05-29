const form = document.getElementById("taskForm");
const container = document.getElementById("tasksContainer");
const searchInput = document.getElementById("searchInput");
const toggleTheme = document.getElementById("toggleTheme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDark = localStorage.getItem("darkMode") === "true";

document.body.classList.toggle("dark", isDark);
toggleTheme.textContent = isDark ? "☀️" : "🌙";

toggleTheme.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark);
  toggleTheme.textContent = isDark ? "☀️" : "🌙";
});

function renderTasks(filter = "") {
  container.innerHTML = "";
  tasks
    .filter(task => task.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, i) => {
      const div = document.createElement("div");
      div.className = `task${task.completed ? " completed" : ""}`;
      div.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <small>Vence: ${task.dueDate}</small>
        <div class="task-actions">
          <button onclick="toggleComplete(${i})">✔️</button>
          <button onclick="editTask(${i})">✏️</button>
          <button onclick="deleteTask(${i})">🗑️</button>
        </div>
      `;
      container.appendChild(div);
    });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(searchInput.value);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const dueDate = form.dueDate.value;

  if (!title || !description || !dueDate) return alert("Completa todos los campos");

  tasks.push({ title, description, dueDate, completed: false });
  saveTasks();
  form.reset();
});

function deleteTask(i) {
  if (confirm("¿Eliminar esta tarea?")) {
    tasks.splice(i, 1);
    saveTasks();
  }
}

function editTask(i) {
  const task = tasks[i];
  form.title.value = task.title;
  form.description.value = task.description;
  form.dueDate.value = task.dueDate;
  tasks.splice(i, 1); // remove for overwrite
  saveTasks();
}

function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
}

searchInput.addEventListener("input", e => renderTasks(e.target.value));

// Inicial
renderTasks();
