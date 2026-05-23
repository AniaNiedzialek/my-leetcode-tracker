// const patterns = [
//   "Two Pointers",
//   "Sliding Window",
//   "Binary Search",
//   "Breadth-First Search",
//   "Backtracking",
//   "Depth-First Search",
//   "Priority Queue (Top K)",
//   "Dynamic Programming"
// ];

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

function getQuestions() {
  const storedQuestions = localStorage.getItem("leetcodeQuestions");

  if (storedQuestions === null) {
    return [];
  }

  return JSON.parse(storedQuestions);
}

function saveQuestions(questions) {
  localStorage.setItem("leetcodeQuestions", JSON.stringify(questions));
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

  if (selectedPattern === null) {
    selectedPatternTitle.textContent = "Select a pattern";
    return;
  }

  selectedPatternTitle.textContent = selectedPattern;

  const questions = getQuestions();

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
  addQuestionPopup.style.display = "block";
});

closeAddQuestionBtn.addEventListener("click", function () {
  addQuestionPopup.style.display = "none";
});

closeViewQuestionBtn.addEventListener("click", function () {
  viewQuestionPopup.style.display = "none";
});

questionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newQuestion = {
    id: Date.now(),
    title: questionTitle.value,
    pattern: questionPattern.value,
    coreIdea: coreIdea.value,
    baseCase: baseCase.value,
    returnLogic: returnLogic.value,
    timeComplexity: timeComplexity.value,
    spaceComplexity: spaceComplexity.value,
    additionalComments: additionalComments.value
  };

  const questions = getQuestions();
  questions.push(newQuestion);
  saveQuestions(questions);

  questionForm.reset();
  addQuestionPopup.style.display = "none";

  selectedPattern = newQuestion.pattern;
  renderQuestions();
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