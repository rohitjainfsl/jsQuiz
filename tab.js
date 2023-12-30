// const variable declare..............
const registrationForm = document.querySelector(".register form");
const loginForm = document.querySelector(".login form");

const registerDiv = document.querySelector(".register");
const loginDiv = document.querySelector(".login");

const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    if (tab.classList.contains("loginTab")) {
      registerDiv.style.display = "none";
      loginDiv.style.display = "flex";
    } else {
      loginDiv.style.display = "none";
      registerDiv.style.display = "flex";
    }
  });
});

//.....................................................................
