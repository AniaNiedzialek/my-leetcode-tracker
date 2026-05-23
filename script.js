import {initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, 
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMSRavwgyyRzPr-KfpWXj30t-38IBEbPE",
    authDomain: "leetcode-tracker-f554d.firebaseapp.com",
    projectId: "leetcode-tracker-f554d",
    storageBucket: "leetcode-tracker-f554d.firebasestorage.app",
    messagingSenderId: "491050209088",
    appId: "1:491050209088:web:061fa20643c629972a34a5",
    measurementId: "G-5F67MND7GE"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const patternData = [
  {
    name: "Two Pointers",
    animation: "assets/avocado.json"
  },
  {
    name: "Sliding Window",
    animation: "assets/broccoli.json"
  },
  {
    name: "Binary Search",
    animation: "assets/coffee.json"
  },
  {
    name: "Breadth-First Search",
    animation: "assets/donut.json"
  },
  {
    name: "Backtracking",
    animation: "assets/mushroom.json"
  },
  {
    name: "Depth-First Search",
    animation: "assets/orange.json"
  },
  {
    name: "Priority Queue (Top K)",
    animation: "assets/potato.json"
  },
  {
    name: "Dynamic Programming",
    animation: "assets/plant.json"
  }
];

const patterns = patternData.map(function (pattern) {
  return pattern.name;
});


let selectedPattern = null;

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");

const patternList = document.getElementById("patternList");
const questionsContainer = document.getElementById("questionsContainer");
const selectedPatternTitle = document.getElementById("selectedPatternTitle");

const openAddQuestionBtn = document.getElementById("openAddQuestionBtn");
const addQuestionPopup = document.getElementById("addQuestionPopup");
const closeAddQuestionBtn = document.getElementById("closeAddQuestionBtn");

const viewQuestionPopup = document.getElementById("viewQuestionPopup");
const closeViewQuestionBtn = document.getElementById("closeViewQuestionBtn");

const questionForm = document.getElementById("questionForm");
const questionPattern = document.getElementById("questionPattern");

const questionTitle = document.getElementById("questionTitle");
const coreIdea = document.getElementById("coreIdea");
const baseCase = document.getElementById("baseCase");
const returnLogic = document.getElementById("returnLogic");
const timeComplexity = document.getElementById("timeComplexity");
const spaceComplexity = document.getElementById("spaceComplexity");
const additionalComments = document.getElementById("additionalComments");

const popupQuestionTitle = document.getElementById("popupQuestionTitle");
const popupPattern = document.getElementById("popupPattern");
const popupCoreIdea = document.getElementById("popupCoreIdea");
const popupBaseCase = document.getElementById("popupBaseCase");
const popupReturnLogic = document.getElementById("popupReturnLogic");
const popupTime = document.getElementById("popupTime");
const popupSpace = document.getElementById("popupSpace");
const popupComments = document.getElementById("popupComments");

let currentUser = null;
let questions = [];
let unsubscribeQuestions = null;

// function getQuestions() {
//   const storedQuestions = localStorage.getItem("leetcodeQuestions");

//   if (storedQuestions === null) {
//     return [];
//   }

//   return JSON.parse(storedQuestions);
// }

// function saveQuestions(questions) {
//   localStorage.setItem("leetcodeQuestions", JSON.stringify(questions));
// }

function getUserQuestionsCollection() {
  return collection(db, "users", currentUser.uid, "questions");
}

signUpBtn.addEventListener("click", async function() {

    try {
        await createUserWithEmailAndPassword(
            auth,
            emailInput.value,
            passwordInput.value
        );        
    } catch (error) {
        alert(error.message);
    }
});
loginBtn.addEventListener("click", async function() {
    try {
        await signInWithEmailAndPassword(
            auth,
            emailInput.value,
            passwordInput.value
        );
    } catch (error) {
        alert(error.message);
    }
});

logoutBtn.addEventListener("click", async function() {
    try {
        await signOut(auth);
    } catch (error) {
        alert(error.message);
    }
});

onAuthStateChanged(auth, function(user) {
    currentUser = user;

    if (user) {
        authStatus.textContent = "Logged in as " + user.email;

        emailInput.style.display = "none";
        passwordInput.style.display = "none";
        signUpBtn.style.display = "none";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";

        listenToUserQuestions();
    } else {
        authStatus.textContent = "Not logged in";

        emailInput.style.display = "block";
        passwordInput.style.display = "block";
        signUpBtn.style.display = "inline-block";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";

        questions = [];

        if (unsubscribeQuestions) {
            unsubscribeQuestions();
            unsubscribeQuestions = null;
        }
        renderQuestions();
    }
});


function listenToUserQuestions() {
    if(unsubscribeQuestions) {
        unsubscribeQuestions();
    }

    const questionsQuery = query(
        getUserQuestionsCollection(),
        orderBy('createdAt', 'desc')
    );

    unsubscribeQuestions = onSnapshot(questionsQuery, function(snapshot) {
        questions = snapshot.docs.map(function (doc) {
            return { id: doc.id, ...doc.data() };
        });
        renderQuestions();
    });
}

function renderPatterns() {
  patternList.innerHTML = "";

  patternData.forEach(function (pattern) {
    const button = document.createElement("button");
    button.classList.add("pattern-card");

    button.innerHTML = `
      <lottie-player
        src="${pattern.animation}"
        background="transparent"
        speed="1"
        loop
        autoplay>
      </lottie-player>

      <span>${pattern.name}</span>
    `;

    button.addEventListener("click", function () {
      selectedPattern = pattern.name;
      renderQuestions();
    });

    patternList.appendChild(button);
  });
}

function renderPatternDropdown() {
  questionPattern.innerHTML = '<option value="">Choose a pattern</option>';

  patterns.forEach(function (pattern) {
    const option = document.createElement("option");
    option.value = pattern;
    option.textContent = pattern;
    questionPattern.appendChild(option);
  });
}

function renderQuestions() {
  questionsContainer.innerHTML = "";

  if (!currentUser) {
    selectedPatternTitle.textContent = "Please log in";
    questionsContainer.innerHTML = "<p>Log in to view your saved questions.</p>";
    return;
  }

  if (selectedPattern === null) {
    selectedPatternTitle.textContent = "Select a pattern";
    questionsContainer.innerHTML = "<p>Choose a pattern to see your questions.</p>";
    return;
  }

  selectedPatternTitle.textContent = selectedPattern;

  const filteredQuestions = questions.filter(function (question) {
    return question.pattern === selectedPattern;
  });

  if (filteredQuestions.length === 0) {
    questionsContainer.innerHTML = "<p>No questions added for this pattern yet.</p>";
    return;
  }

  filteredQuestions.forEach(function (question) {
    const card = document.createElement("div");
    card.classList.add("question-card");

    const title = document.createElement("h3");
    title.textContent = question.title;

    const viewButton = document.createElement("button");
    viewButton.textContent = "View Summary";

    viewButton.addEventListener("click", function () {
      openQuestionPopup(question);
    });

    card.appendChild(title);
    card.appendChild(viewButton);

    questionsContainer.appendChild(card);
  });
}

function openQuestionPopup(question) {
  popupQuestionTitle.textContent = question.title;
  popupPattern.textContent = question.pattern;
  popupCoreIdea.textContent = question.coreIdea;
  popupBaseCase.textContent = question.baseCase;
  popupReturnLogic.textContent = question.returnLogic;
  popupTime.textContent = question.timeComplexity;
  popupSpace.textContent = question.spaceComplexity;
  popupComments.textContent = question.additionalComments;

  viewQuestionPopup.style.display = "block";
}

openAddQuestionBtn.addEventListener("click", function () {
  if (!currentUser) {
    alert("Please log in before adding a question.");
    return;
  }

  addQuestionPopup.style.display = "block";
});

closeAddQuestionBtn.addEventListener("click", function () {
  addQuestionPopup.style.display = "none";
});

closeViewQuestionBtn.addEventListener("click", function () {
  viewQuestionPopup.style.display = "none";
});

questionForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please log in before saving a question.");
    return;
  }

  const newQuestion = {
    title: questionTitle.value,
    pattern: questionPattern.value,
    coreIdea: coreIdea.value,
    baseCase: baseCase.value,
    returnLogic: returnLogic.value,
    timeComplexity: timeComplexity.value,
    spaceComplexity: spaceComplexity.value,
    additionalComments: additionalComments.value,
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(getUserQuestionsCollection(), newQuestion);

    questionForm.reset();
    addQuestionPopup.style.display = "none";

    selectedPattern = newQuestion.pattern;
  } catch (error) {
    alert(error.message);
  }
});

window.addEventListener("click", function (event) {
  if (event.target === addQuestionPopup) {
    addQuestionPopup.style.display = "none";
  }

  if (event.target === viewQuestionPopup) {
    viewQuestionPopup.style.display = "none";
  }
});

renderPatterns();
renderPatternDropdown();
renderQuestions();