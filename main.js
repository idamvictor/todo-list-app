document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const filterSelect = document.getElementById("filter-select");

  // Load tasks from local storage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render tasks on page load
  renderTasks(tasks);

  addBtn.addEventListener("click", function () {
    const taskText = todoInput.value.trim();
    if (taskText !== "") {
      // Add task to the list
      tasks.push({ text: taskText, completed: false });
      // Save tasks to local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      // Render updated tasks based on the current filter
      filterTasks(filterSelect.value);
      // Clear input
      todoInput.value = "";
    }
  });

  filterSelect.addEventListener("change", function () {
    // Render tasks based on the selected filter
    filterTasks(filterSelect.value);
  });

  function filterTasks(filterType) {
    let filteredTasks = [];

    if (filterType === "all") {
      filteredTasks = tasks;
    } else if (filterType === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filterType === "incomplete") {
      filteredTasks = tasks.filter((task) => !task.completed);
    }

    renderTasks(filteredTasks);
  }

  function renderTasks(tasksToRender) {
    todoList.innerHTML = "";
    tasksToRender.forEach(function (task, index) {
      const listItem = document.createElement("li");
      listItem.className = `todo-item ${task.completed ? "completed" : ""}`;
      listItem.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="editable" contenteditable="false">${task.text}</span>
        <button class="edit-btn icon" onclick="editTask(${index})"><ion-icon name="create"></ion-icon></button>
        <button class="delete-btn icon" onclick="deleteTask(${index})"><ion-icon name="trash"></ion-icon></button>
        <button class="save-btn icon" onclick="saveTask(${index})"><ion-icon name="save"></ion-icon></button>
      `;

      // Hide the save button initially
      listItem.querySelector(".save-btn").style.display = "none";

      listItem
        .querySelector('input[type="checkbox"]')
        .addEventListener("change", function () {
          // Update task completion status
          tasks[index].completed = this.checked;
          // Save tasks to local storage
          localStorage.setItem("tasks", JSON.stringify(tasks));
          // Render updated tasks based on the current filter
          filterTasks(filterSelect.value);
        });
      todoList.appendChild(listItem);
    });
  }

  window.editTask = function (index) {
    // Set the task text to be editable
    const editableSpan = document.querySelector(
      `.todo-item:nth-child(${index + 1}) .editable`
    );
    editableSpan.contentEditable = true;
    editableSpan.focus();

    // Toggle visibility of edit and save buttons
    const editBtn = document.querySelector(
      `.todo-item:nth-child(${index + 1}) .edit-btn`
    );
    const saveBtn = document.querySelector(
      `.todo-item:nth-child(${index + 1}) .save-btn`
    );
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  };

  window.saveTask = function (index) {
    // Save the edited task text
    const editableSpan = document.querySelector(
      `.todo-item:nth-child(${index + 1}) .editable`
    );
    tasks[index].text = editableSpan.innerText.trim();
    // Save tasks to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Render updated tasks based on the current filter
    filterTasks(filterSelect.value);
    // Disable editing after saving
    editableSpan.contentEditable = false;

    // Toggle visibility of edit and save buttons
    const editBtn = document.querySelector(
      `.todo-item:nth-child(${index + 1}) .edit-btn`
    );
    const saveBtn = document.querySelector(
      `.todo-item:nth-child(${index + 1}) .save-btn`
    );
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
  };

  window.deleteTask = function (index) {
    // Remove task from the list
    tasks.splice(index, 1);
    // Save tasks to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Render updated tasks based on the current filter
    filterTasks(filterSelect.value);
  };
});
