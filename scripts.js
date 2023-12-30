import questions from "./questions.js";

const wrapper = document.querySelector("#wrapper");
const heading = document.querySelector(".heading");
const forms = document.querySelector("#forms");
const loginForm = document.querySelector(".login form");
const registerForm = document.querySelector(".register form");
const quiz = document.querySelector(".quiz");
const users = [];

//Create local storage vars on page load
if (localStorage.getItem("users") === null) {
  localStorage.setItem("users", users);
}
if (localStorage.getItem("categories") === null) {
  createCategories();
}
if (localStorage.getItem("findLoggedInUser") === null) {
  localStorage.setItem("findLoggedInUser", false);
} else if (JSON.parse(localStorage.getItem("findLoggedInUser")) !== false) {
  //User is logged in
  //no need to show form
  forms.style.display = "none";
  quiz.style.display = "flex";
}

//Add event listeners to forms
registerForm.addEventListener("submit", registerUser);
loginForm.addEventListener("submit", loginUser);

function registerUser(event) {
  event.preventDefault();
  const formElements = Array.from(event.target.elements);
  formElements.pop(); //removing the submit button

  if (isUserAlreadyRegistered(formElements[1])) {
    alert("User is Already Registered");
  } else {
    //register the user
    const userToRegister = {};
    // console.log(localStorage.getItem("users"))
    userToRegister.name = formElements[0].value;
    userToRegister.email = formElements[1].value;
    userToRegister.password = formElements[2].value;
    if (localStorage.getItem("users").length === 0) {
      users.push(userToRegister);
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      const existingUsers = JSON.parse(localStorage.getItem("users"));
      existingUsers.push(userToRegister);
      localStorage.setItem("users", JSON.stringify(existingUsers));
    }
    //and submit the form
    event.target.submit();
  }

  formElements.forEach((elem) => {
    console.log(elem.value);
  });
}

function loginUser(event) {
  event.preventDefault();
  const formElements = Array.from(event.target.elements);
  formElements.pop(); //removing the submit button
  // console.log(formElements)

  if (localStorage.getItem("users").length === 0){
    alert("Register first")
  }
  else{
    JSON.parse(localStorage.getItem("users"))
  }
}

function createCategories() {
  const categories = questions.map((question) => {
    return question.category;
  });
  localStorage.setItem("categories", JSON.stringify(categories));
}

function isUserAlreadyRegistered(email) {
  if (localStorage.getItem("users") === null) return false;
  else if (localStorage.getItem("users") === "") return false;
  else {
    const users = JSON.parse(localStorage.getItem("users"));
    users.forEach((user, index) => {
      if (user.email === email) return true;
    });
    return false;
  }
}
