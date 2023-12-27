import questions from "./questions.js";
let wrapper=document.querySelector("#wrapper")
wrapper.style.display="none"

//check if users data exists in storage
if (localStorage.getItem("users") === null) {
  localStorage.setItem("users", "");
}

if(JSON.parse(localStorage.getItem("findLoggedInUser")) === false){
wrapper.style.display="block"
}
//.....................Akshat code....................................
else{
  document.querySelector("#forms").style.display = "none";
wrapper.style.display="flex"

  document.querySelector("#selectCategory").style.display = "flex";
  const catArr = JSON.parse(localStorage.getItem("categories"));

catArr.forEach((category) => {
const para = document.createElement("p");
para.classList.add("category");
para.innerHTML = category;
//add onclick/addeventlistener
para.addEventListener("click", () => {
quizStart(catArr);
});
document.querySelector("#selectCategory").append(para);
});
let logout=document.createElement("button")
logout.innerHTML="logout"
wrapper.append(logout)
logout.addEventListener("click" ,()=>{
  localStorage.setItem("findLoggedInUser",false)
  window.location.href="index.html"
})
}
//.......................Akshat code...................................

//
if (localStorage.getItem("findLoggedInUser") === null)
  localStorage.setItem("findLoggedInUser", false);

  

const registrationForm = document.querySelector(".register form");
const loginForm = document.querySelector(".login form");

registrationForm.addEventListener("submit", registerUser);
loginForm.addEventListener("submit", loginUser);

const questionDiv = document.querySelector(".question");
const optionsDiv = document.querySelectorAll(".option");
const userAnswers = [];
let currentQuestionNumber = 0;
let temp;
let timer = 10;
const timerDiv = document.querySelector(".timer");

function registerUser(event) {
  event.preventDefault();
  //get data from local storage
  // and check if email exists

  if (localStorage.getItem("users") !== null) {
    if (localStorage.getItem("users") !== "") {
      // Get existing users details
      const usersArr = JSON.parse(localStorage.getItem("users"));

      const rname = document.querySelector("#rname").value;
      const remail = document.querySelector("#remail").value;
      const rpass = document.querySelector("#rpass").value;
      const rcpass = document.querySelector("#rcpass").value;

      //Check if email which user entered in form
      // exists in users details

      let emailExists = false;

      usersArr.forEach((user) => {
        if (user.remail === remail) emailExists = true;
      });

      if (emailExists === false) {
        const obj = {
          rname: rname,
          remail: remail,
          rpass: rpass,
          rcpass: rcpass,
        };
        usersArr.push(obj);
        localStorage.setItem("users", JSON.stringify(usersArr));
        document.querySelector(".register form").submit();
      } else {
        alert("Email already exists");
      }
    } else {
      //This is the very first user, simply put the data in
      const rname = document.querySelector("#rname").value;
      const remail = document.querySelector("#remail").value;
      const rpass = document.querySelector("#rpass").value;
      const rcpass = document.querySelector("#rcpass").value;

      const obj = {
        rname: rname,
        remail: remail,
        rpass: rpass,
        rcpass: rcpass,
      };

      const usersArr = [];
      usersArr.push(obj);
      localStorage.setItem("users", JSON.stringify(usersArr));

      document.querySelector(".register form").submit();
    }
  }
}

function loginUser(event) {
  event.preventDefault();
  const usersArr = JSON.parse(localStorage.getItem("users"));

  const lemail = document.querySelector("#lemail").value;
  const lpass = document.querySelector("#lpass").value;

  let isUserAllowed = false;

  usersArr.forEach((user) => {
    if (user.remail === lemail && user.rpass === lpass) {
      isUserAllowed = true;
      localStorage.setItem("findLoggedInUser", true);
    }

    
  });

  if (isUserAllowed) {
    //log user in
    document.querySelector("#forms").style.display = "none";
    document.querySelector("#selectCategory").style.display = "flex";

    // check if categories exist
    //if not, create them

    if (localStorage.getItem("categories") === null) {
      createCategories();
    }

    const catArr = JSON.parse(localStorage.getItem("categories"));

    catArr.forEach((category) => {
      const para = document.createElement("p");
      para.classList.add("category");
      para.innerHTML = category;
      //add onclick/addeventlistener
      para.addEventListener("click", () => {
        quizStart(catArr);
      });
      document.querySelector("#selectCategory").append(para);
    });
  } else {
    alert("Incorrect Credentials");
  }
}


function createCategories() {
  const categories = ["Sports", "Geography", "Programming", "Current Affairs"];
  localStorage.setItem("categories", JSON.stringify(categories));
}

function quizStart(catArr) {
  //add click event on options
  optionsDiv.forEach((para) => {
    para.addEventListener("click", (event) => {
      storeUserAnswer(event, userAnswers);
    });
  });

  //GET QUESTIONS FROM APPROPRIATE CATEGORY

  temp = questions.filter((cat) => {
    return cat.category === event.target.innerHTML;
  });

  document.querySelector("#selectCategory").style.display = "none";
  document.querySelector("#quizStart").style.display = "flex";

  //display first question and its options
  nextQuestion();

  // start decrementing the timer
  const interval = setInterval(() => {
    // when timer reaches 0
    // change the question

    if (timer === 1 || currentQuestionNumber >= temp[0].qna.length) {
      // are there more questions to display?
      if (currentQuestionNumber === temp[0].qna.length) {
        clearInterval(interval);
        document.querySelector("#quizStart").style.display = "none";
        calculateScore(userAnswers, temp[0].qna);
      } else {
        timer = 10;
        timerDiv.innerHTML = timer;

        currentQuestionNumber++;
        userAnswers.push(null);
        console.log(currentQuestionNumber)

        nextQuestion();
      }
    } else timerDiv.innerHTML = --timer;
  }, 1000);
}

// to display the question and its options
function nextQuestion() {
  questionDiv.innerHTML = temp[0].qna[currentQuestionNumber].q;

  optionsDiv.forEach((para, index) => {
    para.innerHTML = temp[0].qna[currentQuestionNumber].op[index];
  });
}

//to store user answer
function storeUserAnswer(event, userAnswers) {
  userAnswers.push(event.target.innerHTML);

  // user has chosen an option,
  // don't wait, change the question
  timer = 10;
  timerDiv.innerHTML = timer;
  currentQuestionNumber++;
if(currentQuestionNumber<temp[0].qna.length)
  nextQuestion();
}

//calculate user answers
function calculateScore(userAnswers, actualAnswers) {
  let score = 0;
  userAnswers.forEach((ua, index) => {
    if (String(ua) === String(actualAnswers[index].a)) {
      score++;
    }
  });
  let answer = "You scored " + score + " out of " + actualAnswers.length;
  const totalScore = document.createElement("p");
  totalScore.innerHTML = answer;
  document.querySelector("#wrapper").append(totalScore);
}
