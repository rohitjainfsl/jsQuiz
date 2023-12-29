const questions = [
  {
    category: "Sports",
    qna: [
      {
        q: "Which country won the Cricket World Cup 2023?",
        a: "Australia",
        op: ["India", "Australia", "South Africa", "New Zealand"],
        type: "string",
      },
      {
        q: "Who holds the record of most runs in a single edition of a Cricket World Cup?",
        a: "Rachin Ravindra",
        op: [
          "Sachin Tendulkar",
          "Virat Kohli",
          "Rachin Ravindra",
          "Rohit Sharma",
        ],
        type: "string",
      },
    ],
  },
  {
    category: "Geography",
    qna: [
      {
        q: "Which of the following is a land locked country?",
        a: "Afghanistan",
        op: ["Pakistan", "Brazil", "India", "Afghanistan"],
        type: "string",
      },
      {
        q: "How many states in India does Tropic of Cancer passes through?",
        a: 8,
        op: [7, 8, 9, 5],
        type: "string",
      },
    ],
  },
  {
    category: "Programming",
    qna: [
      {
        q: "In most programming languages, the starting index of an array is ...?",
        a: 0,
        op: [0, 1, "undefined", "null"],
        type: "string",
      },
      {
        q: "Which of the following is not a programming language?",
        a: "Diamond",
        op: ["Perl", "Ruby", "Diamond", "Python"],
        type: "string",
      },
      {
        q: "Which of the following is not a code editor?",
        a: "Git",
        op: ["Git", "VS Code", "Notepad++", "Atom"],
        type: "string",
      },
    ],
  },
  {
    category: "Current Affairs",
    qna: [
      {
        q: "Which country hosted the G20 summit in 2023?",
        a: "India",
        op: ["India", "Brazil", "China", "Russia"],
        type: "string",
      },
      {
        q: "Which of the state in India did not had a legislative elections in 2023?",
        a: "Uttar Pradesh",
        op: ["Uttar Pradesh", "Punjab", "Rajasthan", "Chhatisgarh"],
        type: "string",
      },
    ],
  },
  {
    category: "Image Queries",
    qna: [
      {
        q: "Question 01",
        a: "image/image1.webp",
        op: [
          "image/image1.webp",
          "image/image2.webp",
          "image/image3.webp",
          "image/image4.webp",
        ],
        type: "image",
      },
      {
        q: "Question 02",
        a: "image/image1.webp",
        op: [
          "image/image1.webp",
          "image/image2.webp",
          "image/image3.webp",
          "image/image4.webp",
        ],
        type: "image",
      },
    ],
  },
];

export default questions;
