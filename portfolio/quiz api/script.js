let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let currentQuiz = "";

// Elements
const quizSelectEl = document.getElementById("quiz-select");
const startBtn = document.getElementById("start-btn");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const playerNameEl = document.getElementById("player-name");
const leaderboardEl = document.getElementById("leaderboard");
const questionNumberEl = document.getElementById("question-number");

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Hide quiz UI initially
questionEl.style.display = "none";
choicesEl.style.display = "none";
nextBtn.style.display = "none";
resultEl.style.display = "none";
playerNameEl.style.display = "block";
leaderboardEl.style.display = "block";

// Start quiz event
startBtn.addEventListener("click", () => {
  const selectedQuiz = quizSelectEl.value;
  const playerName = playerNameEl.value.trim();
  if (!selectedQuiz || !playerName) {
    alert("Please select a quiz and enter your name.");
    return;
  }
  currentQuiz = selectedQuiz;
  fetchQuiz(selectedQuiz);
});

// Fetch questions from selected JSON file
function fetchQuiz(filename) {
  fetch(filename)
    .then(response => response.json())
    .then(data => {
      // Support both array and object formats
      quizData = Array.isArray(data) ? data : data.quiz;
      shuffle(quizData);
      currentQuestionIndex = 0;
      score = 0;
      showQuizUI();
      loadQuestion();
    })
    .catch(error => {
      questionEl.textContent = "Error loading quiz data.";
      questionEl.style.display = "block";
      console.error("Error:", error);
    });
}

function showQuizUI() {
  quizSelectEl.style.display = "none";
  startBtn.style.display = "none";
  playerNameEl.style.display = "none";
  leaderboardEl.style.display = "none";
  questionNumberEl.style.display = "block"; // Show question number
  questionEl.style.display = "block";
  choicesEl.style.display = "block";
  nextBtn.style.display = "none";
  resultEl.style.display = "none";
}

function loadQuestion() {
  const current = quizData[currentQuestionIndex];
  // Display question number
  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
  questionEl.textContent = current.question;
  choicesEl.innerHTML = "";

  // Shuffle choices before displaying
  const shuffledChoices = [...current.choices];
  shuffle(shuffledChoices);

  shuffledChoices.forEach(choice => {
    const li = document.createElement("li");
    li.textContent = choice;
    li.onclick = () => checkAnswer(choice, current.answer);
    choicesEl.appendChild(li);
  });
}

function checkAnswer(selected, correct) {
  const items = choicesEl.querySelectorAll("li");
  items.forEach(li => {
    if (li.textContent === correct) {
      li.style.background = "green";
    } else if (li.textContent === selected) {
      li.style.background = "red";
    }
    li.style.pointerEvents = "none";
  });
  if (selected === correct) score++;
  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
    nextBtn.style.display = "none";
  } else {
    showResult();
  }
});

function showResult() {
  questionNumberEl.style.display = "none"; // Hide question number
  questionEl.style.display = "none";
  choicesEl.style.display = "none";
  nextBtn.style.display = "none";
  resultEl.style.display = "block";
  resultEl.textContent = `You scored ${score} out of ${quizData.length}!`;
  saveScore(currentQuiz, playerNameEl.value.trim(), score);
  showLeaderboard(currentQuiz);
  setTimeout(() => {
    quizSelectEl.style.display = "block";
    startBtn.style.display = "block";
    playerNameEl.style.display = "block";
    leaderboardEl.style.display = "block";
  }, 2000);
}

// Save score to localStorage
function saveScore(quiz, name, score) {
  if (!name) return;
  const key = `leaderboard_${quiz}`;
  const leaderboard = JSON.parse(localStorage.getItem(key)) || [];
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(leaderboard));
}

// Show leaderboard for selected quiz
function showLeaderboard(quiz) {
  if (!quiz) {
    leaderboardEl.innerHTML = "";
    return;
  }
  const key = `leaderboard_${quiz}`;
  const leaderboard = JSON.parse(localStorage.getItem(key)) || [];
  let html = `<h2>Leaderboard</h2><ol>`;
  leaderboard.slice(0, 10).forEach(entry => {
    html += `<li>${entry.name}: ${entry.score}</li>`;
  });
  html += `</ol>`;
  leaderboardEl.innerHTML = html;
}
