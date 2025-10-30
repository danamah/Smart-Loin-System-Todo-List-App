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
console.log(welcomeHeader);

var taskinput = document.querySelector("#add-task");
var addTaskBtn = document.querySelector("#add-task-btn");

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
var taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// *#####functions
// ~addTask function (C ===> CRUD)

function addTask() {
  var taskInfo = {
    taskTitle: taskinput.value,
  };
}
