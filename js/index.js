// ^ HTML elements
var userMailInput = document.querySelector("#user-mail");
var userPassInput = document.querySelector("#user-pass");
var logBtn = document.querySelector("#logBtn");
var signBtn = document.querySelector("#signBtn");
var userNameInput = document.querySelector("#userName");
var welcomeHeader = document.querySelector(".main-page h1.welcome");
var barName = document.querySelector("#bar-user");
var barMail = document.querySelector("#bar-email");
var inputRegex = {
  userName: /^[A-Za-z][\sa-zA-Z]*$/,
  userMail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  userPass: /^.{6,}$/,
};
var taskInput = document.getElementById("add-task");
var addTaskBtn = document.getElementById("add-task-btn");
var tasksContainer = document.getElementById("tasks-container");
var completedContainer = document.getElementById("completed-container");
// ^ function
// &#####validation Function
function isValidInput(regex, userInput) {
  if (regex.test(userInput.value)) {
    userInput.classList.add("is-valid");
    userInput.classList.remove("is-invalid");
    userInput.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    userInput.classList.add("is-invalid");
    userInput.classList.remove("is-valid");
    userInput.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}
// &#####logcalStorage Function
function addUserToLocalStorage(user) {
  var users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

// ============== LOGIN PAGE ==============
// ! important condition to check the existence of the button in login page after loading
if (logBtn) {
  logBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var email = userMailInput.value;
    var password = userPassInput.value;
    var users = JSON.parse(localStorage.getItem("users")) || [];
    var validUser = users.find(
      (u) => u.userMail === email && u.userPass === password
    );
    if (validUser) {
      localStorage.setItem("currentUser", validUser.userName);
      localStorage.setItem("currentUserMail", validUser.userMail);
      window.location.href = "./ToDoListApp.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password!",
      });
    }
  });
}

// ============== Regester PAGE ==============
// ! important condition to check the existence of the button in rgestration page after loading

if (signBtn) {
  var usersList = JSON.parse(localStorage.getItem("users")) || [];

  window.addEventListener("load", () => {
    usersList = JSON.parse(localStorage.getItem("users")) || [];
  });

  document.addEventListener("input", function (e) {
    if (e.target === userNameInput) {
      isValidInput(inputRegex.userName, userNameInput);
    } else if (e.target === userMailInput) {
      isValidInput(inputRegex.userMail, userMailInput);
    } else if (e.target === userPassInput) {
      isValidInput(inputRegex.userPass, userPassInput);
    }
  });

  signBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let isNameValid = isValidInput(inputRegex.userName, userNameInput);
    let isMailValid = isValidInput(inputRegex.userMail, userMailInput);
    let isPassValid = isValidInput(inputRegex.userPass, userPassInput);

    if (isNameValid && isMailValid && isPassValid) {
      let newUser = {
        userName: userNameInput.value,
        userMail: userMailInput.value,
        userPass: userPassInput.value,
      };

      let userExists = usersList.some((u) => u.userMail === newUser.userMail);
      if (userExists) {
        Swal.fire({
          title: "You've already register?",
          text: "Try another email address or sign in with your existing email",
          icon: "question",
        });
        return;
      }

      usersList.push(newUser);
      addUserToLocalStorage(newUser);

      var successMsg = signBtn.nextElementSibling;
      if (successMsg && successMsg.classList.contains("text-success")) {
        successMsg.classList.replace("d-none", "d-block");
      }

      userNameInput.value = userMailInput.value = userPassInput.value = "";
      userNameInput.classList.remove("is-valid");
      userMailInput.classList.remove("is-valid");
      userPassInput.classList.remove("is-valid");
    }
  });
}

// ============== ToDoList App PAGE ==============
window.addEventListener("DOMContentLoaded", function () {
  if (welcomeHeader) {
    var userName = localStorage.getItem("currentUser");
    var userMail = localStorage.getItem("currentUserMail");
    if (userName) {
      welcomeHeader.innerHTML = `Hello ${userName}`;
      barName.innerHTML = `${userName}`;
      barMail.innerHTML = `${userMail}`;
    } else {
      window.location.href = "./index.html";
    }
  }
  var currentUser = localStorage.getItem("currentUser");
  // if (!currentUser) {
  //   window.location.href = "./index.html";
  // }

  var storageKey = `tasks_${currentUser}`;
  var tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
  // ^display all tasks when reload
  displayTasks();

  // *#####functions
  // ~addTask function (C ===> CRUD)
  if (addTaskBtn && taskInput) {
    addTaskBtn.addEventListener("click", function () {
      const title = taskInput.value.trim();
      if (!title) return;

      const newTask = {
        id: Date.now(),
        title: title,
        completed: false,
      };
      // add the task to local storage
      tasks.push(newTask);

      saveAndDisplay();
      //   ~ reset the input
      taskInput.value = "";
    });
  }

  // ~ display Tasks (R (Read/Retrive) ===> CRUD)
  function displayTasks() {
    if (!tasksContainer || !completedContainer) return;
    // clean the container for new html
    tasksContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    tasks.forEach((task) => {
      const taskEl = document.createElement("div");
      taskEl.className =
        "task d-flex justify-content-between align-items-center p-2 mb-2 border rounded";
      taskEl.dataset.id = task.id;

      taskEl.innerHTML = `
      <p class="mt-3 flex-grow-1">${task.title}</p>
      <div class="operations d-flex align-items-center gap-2">
        <i class="fa-solid fa-trash text-black delete-btn"></i>
        <i class="fa-solid fa-pen-to-square text-white edit-btn"></i>
        <div class="check-box p-2 border rounded check-btn ${
          task.completed ? "bg-success text-white" : ""
        }">
          <i class="fa-solid fa-check ${task.completed ? "" : "d-none"}"></i>
        </div>
      </div>
    `;

      // add events on icons and checkbutton
      const deleteBtn = taskEl.querySelector(".delete-btn");
      const editBtn = taskEl.querySelector(".edit-btn");
      const checkBtn = taskEl.querySelector(".check-btn");

      deleteBtn.addEventListener("click", () => deleteTask(task.id));
      editBtn.addEventListener("click", () => editTask(task.id, task.title));
      checkBtn.addEventListener("click", () => toggleComplete(task.id));

      // put completed task in copleted container
      if (task.completed) {
        completedContainer.appendChild(taskEl);
      } else {
        tasksContainer.appendChild(taskEl);
      }
    });
  }
  if (tasksContainer && completedContainer) {
    displayTasks();
  }
  // ~ ============== deleteTask function ==============
  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveAndDisplay();
  }

  // ~ ============== update function ==============
  function editTask(id, oldTitle) {
    const newTitle = prompt("Edit Task:", oldTitle);
    if (newTitle === null || newTitle.trim() === "") return;

    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.title = newTitle.trim();
      saveAndDisplay();
    }
  }

  // ~ ============== done or redone the task ==============
  function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveAndDisplay();
    }
  }

  // ============== save and display function ==============
  function saveAndDisplay() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    displayTasks();
  }

  // ============== search by task name ==============
  const searchInput = document.getElementById("search-tasks");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const term = this.value.toLowerCase();
      const filtered = tasks.filter((t) =>
        t.title.toLowerCase().includes(term)
      );
      displayFilteredTasks(filtered);
    });
  }

  function displayFilteredTasks(filteredTasks) {
    tasksContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    filteredTasks.forEach((task) => {
      const taskEl = document.createElement("div");
      taskEl.className =
        "task d-flex justify-content-between align-items-center p-2 mb-2 border rounded";
      taskEl.innerHTML = `
      <p class="mt-3 flex-grow-1">${task.title}</p>
      <div class="operations d-flex align-items-center gap-2">
        <i class="fa-solid fa-trash text-black delete-btn"></i>
        <i class="fa-solid fa-pen-to-square text-white edit-btn"></i>
        <div class="check-box p-2 border rounded check-btn ${
          task.completed ? "bg-success text-white" : ""
        }">
          <i class="fa-solid fa-check ${task.completed ? "" : "d-none"}"></i>
        </div>
      </div>
    `;

      // add event on completed task container
      taskEl.querySelector(".delete-btn").onclick = () => deleteTask(task.id);
      taskEl.querySelector(".edit-btn").onclick = () =>
        editTask(task.id, task.title);
      taskEl.querySelector(".check-btn").onclick = () =>
        toggleComplete(task.id);

      if (task.completed) {
        completedContainer.appendChild(taskEl);
      } else {
        tasksContainer.appendChild(taskEl);
      }
    });
  }
});
