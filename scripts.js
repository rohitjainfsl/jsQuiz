//Import variable...................
import questions from "./questions.js";

//.........................................................................

//Const variable....................
const questionDiv = document.querySelector(".question");
const optionsDiv = document.querySelectorAll(".option");
const userAnswers = [];
const timerDiv = document.querySelector(".timer");
const registrationForm = document.querySelector(".register form");
const loginForm = document.querySelector(".login form");

//.........................................................................

//Let variable......................
let wrapper = document.querySelector("#wrapper");
let currentQuestionNumber = 0;
let temp;
let timer = 10;

//.........................................................................

//addEventListener..................
//.........................................................................

//Register.....

registrationForm.addEventListener("submit", registerUser);
function registerUser(event) {
  event.preventDefault();
  //get data from local storage
  // and check if email exists

  if (
    document.getElementById("rpass").value ===
    document.getElementById("rcpass").value
  ) {
    console.log(
      document.getElementById("rpass").value,
      document.getElementById("rcpass").value
    );

    //...............................................
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
    //...............................................
  } else {
    alert("Password & Confirm Password are not same");
  }
}

//.........................................................................

//...........................Login User function...........................
//Login........
loginForm.addEventListener("submit", loginUser);
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
    // document.querySelector(".quiz").style.display = "flex";
    document.querySelector(".quiz").style.display = "flex";

    // check if categories exist
    //if not, create them

    const catArr = JSON.parse(localStorage.getItem("categories"));

    catArr.forEach((category) => {
      const para = document.createElement("p");
      para.classList.add("category");
      para.innerHTML = category;

      //add onclick/addeventlistener
      para.addEventListener("click", (e) => {
        quizStart(e, catArr);
      });
      document.querySelector("#selectCategory").append(para);
    });
  } else {
    alert("Incorrect Credentials");
  }
}
//.........................................................................

//Logout.......
//Logout button below quiz after beginning of quizstart till score.
let logout = document.createElement("button");
logout.classList.add("logout");
logout.innerHTML = "Logout";
logout.addEventListener("click", () => {
  localStorage.setItem("findLoggedInUser", false);
  window.location.href = "index.html";
});
wrapper.append(logout);

//tabLogout button for continous showing till logout
let tabLogout = document.querySelector(".tabLogout");
tabLogout.addEventListener("click", () => {
  localStorage.setItem("findLoggedInUser", false);
  window.location.href = "index.html";
});

//.........................................................................

//Condition for swapping form and quiz.....................................
if (JSON.parse(localStorage.getItem("findLoggedInUser")) === false) {
  document.querySelector("#forms").style.display = "flex";
  document.querySelector(".quiz").style.display = "none";
} else {
  document.querySelector(".quiz").style.display = "flex";
  document.querySelector("#forms").style.display = "none";
  const catArr = JSON.parse(localStorage.getItem("categories"));

  catArr.forEach((category) => {
    const para = document.createElement("p");
    para.classList.add("category");
    para.innerHTML = category;
    //add onclick/addeventlistener
    para.addEventListener("click", (e) => {
      quizStart(e, catArr);
    });
    document.querySelector("#selectCategory").append(para);
  });

  wrapper.append(logout);
}

//.........................................................................

//locatStorage......................
//check if users data exists in storage
if (localStorage.getItem("users") === null) {
  localStorage.setItem("users", "");
}

//create categories if storage is null
if (localStorage.getItem("categories") === null) {
  createCategories();
}

//....................Add categories to local storage...........................
// add feature will add during node js code work, in both categories and question.
function createCategories() {
  const categories = [
    "Sports",
    "Geography",
    "Programming",
    "Current Affairs",
    "Image Queries",
  ];
  localStorage.setItem("categories", JSON.stringify(categories));
}

//check local storage empty condition
if (localStorage.getItem("findLoggedInUser") === null) {
  localStorage.setItem("findLoggedInUser", false);
}
//.........................................................................

//User define function....................................................
//Start quiz function.................
function quizStart(e, catArr) {
  //add click event on options
  optionsDiv.forEach((para) => {
    para.addEventListener("click", (event) => {
      optionsDiv.forEach((opt) => {
        opt.style.pointerEvents = "none";
      });
      storeUserAnswer(event, userAnswers);
    });
  });

  //GET QUESTIONS FROM APPROPRIATE CATEGORY

  temp = questions.filter((cat) => {
    return cat.category === e.target.innerHTML;
    //discussion : event.target.innerHTML value ?? where it come from
  });

  document.querySelector("#selectCategory").style.display = "none";
  document.querySelector("#quizStart").style.display = "flex";
  document.querySelector(".logout").style.display = "inline-block";

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
        nextQuestion();
      }
    } else timerDiv.innerHTML = --timer;
  }, 1000);
}

//.............................................................................

// to display the question and its options

function nextQuestion() {
  optionsDiv.forEach((opt) => {
    opt.style.pointerEvents = "all";
  });
  questionDiv.innerHTML = temp[0].qna[currentQuestionNumber].q;
  if (temp[0].qna[currentQuestionNumber].type === "image") {
    removeImages();
    optionsDiv.forEach((para, index) => {
      const image = document.createElement("img");
      image.src = temp[0].qna[currentQuestionNumber].op[index];
      para.append(image);
    });
  } else {
    optionsDiv.forEach((para, index) => {
      para.innerHTML = temp[0].qna[currentQuestionNumber].op[index];
    });
  }
}

//.............................................................................

//to store user answer
function storeUserAnswer(event, userAnswers) {
  userAnswers.push(event.target.innerHTML);

  // user has chosen an option,
  // don't wait, change the question
  timer = 10;
  timerDiv.innerHTML = timer;
  currentQuestionNumber++;

  if (currentQuestionNumber < temp[0].qna.length) nextQuestion();
}

//.............................................................................

//calculate user answers
function calculateScore(userAnswers, actualAnswers) {
  let score = 0;
  userAnswers.forEach((ua, index) => {
    if (String(ua) === String(actualAnswers[index].a)) {
      score++;
    }
  });
  let answer = "You scored " + score + " out of " + actualAnswers.length;

  //......................................................
  const totalScore = document.createElement("p");
  totalScore.innerHTML = answer;
  totalScore.style.fontSize = "2rem";
  document.querySelector("#wrapper").append(totalScore);
}

//..............................................

//remove images
function removeImages() {
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    if (option.children.length > 0) option.children[0].remove();
  });
}

//.............................................................................

//.............................................................................

// document.querySelector("#quizStart").style.display = "none";
// document.querySelector(".logout").style.display = "none";

//.............................................................................
