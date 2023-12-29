import questions from "./questions.js";
let wrapper = document.querySelector("#wrapper");

//check if users data exists in storage
if (localStorage.getItem("users") === null) {
  localStorage.setItem("users", "");
}

if (localStorage.getItem("categories") === null) {
  createCategories();
}

if (JSON.parse(localStorage.getItem("findLoggedInUser")) === false) {
  document.querySelector("#forms").style.display = "flex";
  document.querySelector(".quiz").style.display = "none";
  // console.log(JSON.parse(localStorage.getItem("findLoggedInUser")));
} else {
  // console.log(JSON.parse(localStorage.getItem("findLoggedInUser")));
  document.querySelector(".quiz").style.display = "flex";
  document.querySelector("#forms").style.display = "none";
  // document.querySelector("#selectCategory").style.display = "flex";
  const catArr = JSON.parse(localStorage.getItem("categories"));
  console.log(catArr);

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
  let logout = document.createElement("button");
  logout.classList.add("logout");
  logout.innerHTML = "Logout";
  logout.addEventListener("click", () => {
    localStorage.setItem("findLoggedInUser", false);
    window.location.href = "index.html";
  });
  wrapper.append(logout);
}

if (localStorage.getItem("findLoggedInUser") === null)
  localStorage.setItem("findLoggedInUser", false);

const registrationForm = document.querySelector(".register form");
const loginForm = document.querySelector(".login form");

registrationForm.addEventListener("submit", registerUser);
loginForm.addEventListener("submit", loginUser);

const questionDiv = document.querySelector(".question");
const optionsParentDiv = document.querySelector(".options");
const optionsDiv = document.querySelectorAll(".option");
const userAnswers = [];
let currentQuestionNumber = 0;
let temp;
let timer = 10;
const timerDiv = document.querySelector(".timer");

//.............................................................................

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

//................................Login User function.................................

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

    //LOGOUT BUTTON
    let logout = document.createElement("button");
    logout.classList.add("logout");
    logout.innerHTML = "Logout";
    logout.addEventListener("click", () => {
      localStorage.setItem("findLoggedInUser", false);
      window.location.href = "index.html";
    });
    wrapper.append(logout);
  } else {
    alert("Incorrect Credentials");
  }
}

//....................Add categories to local storage...........................

function createCategories() {
  const categories = ["Sports", "Geography", "Programming", "Current Affairs"];
  localStorage.setItem("categories", JSON.stringify(categories));
}

//.............................................................................
document.querySelector("#quizStart").style.display = "none";
document.querySelector(".logout").style.display = "none";
function quizStart(e, catArr) {
  //add click event on options
  optionsDiv.forEach((para) => {
    para.addEventListener("click", (event) => {
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
        console.log(currentQuestionNumber);

        nextQuestion();
      }
    } else timerDiv.innerHTML = --timer;
  }, 1000);
}

// to display the question and its options
// function nextQuestion() {
//   questionDiv.innerHTML = temp[0].qna[currentQuestionNumber].q;
//   console.log(temp[0].qna[currentQuestionNumber].type);

//   if (temp[0].qna[currentQuestionNumber].type === "image") {
//     optionsDiv.forEach((para, index) => {
//       const image = document.createElement("img");
//       image.src = temp[0].qna[currentQuestionNumber].op[index];
//       para.append(image);
//     });
//   } else {
//     optionsDiv.forEach((para, index) => {
//       para.innerHTML = temp[0].qna[currentQuestionNumber].op[index];
//     });
//   }
// }

function nextQuestion() {
  questionDiv.innerHTML = temp[0].qna[currentQuestionNumber].q;
  if (temp[0].qna[currentQuestionNumber].type === "image") {
    // document.querySelectorAll(".option").style.display = "none";

    // document.querySelector(".option1").style.display = "none";
    // document.querySelector(".option2").style.display = "none";
    // document.querySelector(".option3").style.display = "none";
    // document.querySelector(".option4").style.display = "none";

    optionsDiv.forEach((para, index) => {
      const div = document.createElement("div");
      // div.classList.add("image");
      // document.querySelector(".options").append(div);
      para.classList.add("image");
      document.querySelector(".options").append(para);
      const image = document.createElement("img");
      image.src = temp[0].qna[currentQuestionNumber].op[index];
      // div.append(image);
      para.append(image);
      console.log("image");
    });
  } else {
    // document.querySelector(".image").style.display = "none";

    optionsDiv.forEach((para, index) => {
      para.innerHTML = temp[0].qna[currentQuestionNumber].op[index];
    });
    console.log("string");
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
  // document.querySelectorAll(".option").style.pointerEvents = "none";

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

  //add logout button in calculate score ...........
  let logout2 = document.createElement("button");
  document.querySelector(".logout").style.display = "none";

  logout2.innerHTML = "logout";
  logout2.classList.add("logout");

  wrapper.append(logout2);
  logout2.addEventListener("click", () => {
    localStorage.setItem("findLoggedInUser", false);
    window.location.href = "index.html";
  });
  //......................................................
  const totalScore = document.createElement("p");
  totalScore.innerHTML = answer;
  totalScore.style.fontSize = "2rem";
  document.querySelector("#wrapper").append(totalScore);
}
