const _description = Symbol('description');
const _deadline = Symbol('deadline');

class TaskManager {
  constructor() {
    this.tasks = new Map();
    this.categories = new Set();
    this.nextId = 1;
  }

  addTask(title, description, deadline, category) {
    const id = this.nextId++;
    const task = {
      id,
      title,
      [_description]: description,
      [_deadline]: deadline,
      category
    };
    this.tasks.set(id, task);
    if (category) this.categories.add(category);
    return id;
  }

  deleteTask(id) {
    return this.tasks.delete(id);
  }

  getTask(id) {
    const task = this.tasks.get(id);
    if (!task) return null;
    return {
      id: task.id,
      title: task.title,
      category: task.category
    };
  }

  getSensitiveInfo(id) {
    const task = this.tasks.get(id);
    if (!task) return null;
    return {
      description: task[_description],
      deadline: task[_deadline]
    };
  }

  listTasks() {
    return Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      title: task.title,
      category: task.category
    }));
  }

  listCategories() {
    return Array.from(this.categories);
  }
}

// === DOM INTERACTION ===
const tm = new TaskManager();
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const categoryList = document.getElementById('categoryList');

function updateTaskList() {
  taskList.innerHTML = '';
  const tasks = tm.listTasks();
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${task.title}</strong> (${task.category || 'Uncategorized'})</span>
      <div class="task-buttons">
        <button onclick="showDetails(${task.id})">Details</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function updateCategoryList() {
  categoryList.innerHTML = '';
  tm.listCategories().forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    categoryList.appendChild(li);
  });
}

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const deadline = document.getElementById('deadline').value;
  const category = document.getElementById('category').value.trim();

  if (title && description && deadline) {
    tm.addTask(title, description, deadline, category);
    taskForm.reset();
    updateTaskList();
    updateCategoryList();
  }
});

function deleteTask(id) {
  tm.deleteTask(id);
  updateTaskList();
}

function showDetails(id) {
  const info = tm.getSensitiveInfo(id);
  if (info) {
    alert(`Description: ${info.description}\nDeadline: ${info.deadline}`);
  }
}

// Initial render
updateTaskList();
updateCategoryList();
