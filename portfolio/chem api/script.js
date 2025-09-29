let quizData = [];
let currentQuestion = 0;
let score = 0;
let playerName = '';

let selectedAmount = 5;
let quizSubset = [];

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const leaderboardEl = document.getElementById('leaderboard');

const questionCountSelect = document.getElementById('question-count');
if (questionCountSelect) {
    questionCountSelect.onchange = function () {
        selectedAmount = parseInt(this.value, 10);
    };
}

async function loadQuiz() {
    const response = await fetch('./chemistry_quiz.json');
    quizData = await response.json();
    // Shuffle and select the number of questions
    quizSubset = quizData.slice();
    for (let i = quizSubset.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizSubset[i], quizSubset[j]] = [quizSubset[j], quizSubset[i]];
    }
    quizSubset = quizSubset.slice(0, selectedAmount);
}

function showQuestion() {
    if (currentQuestion >= quizSubset.length) {
        showResult();
        return;
    }
    const q = quizSubset[currentQuestion];
    questionEl.textContent = `Q${currentQuestion + 1}: ${q.question}`;
    choicesEl.innerHTML = '';
    // Scramble the options
    const scrambledOptions = q.options.slice();
    for (let i = scrambledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambledOptions[i], scrambledOptions[j]] = [scrambledOptions[j], scrambledOptions[i]];
    }
    scrambledOptions.forEach((opt, idx) => {
        const li = document.createElement('li');
        li.textContent = opt;
        li.className = 'choice';
        li.onclick = () => selectAnswer(opt);
        choicesEl.appendChild(li);
    });
    nextBtn.style.display = 'none';
    resultEl.textContent = '';
}

function selectAnswer(selected) {
    const correct = quizSubset[currentQuestion].answer;
    const choices = document.querySelectorAll('.choice');
    choices.forEach(li => {

        li.onclick = null;
        if (li.textContent === correct) {
            li.style.background = '#aaffaa';
        }
        if (li.textContent === selected && selected !== correct) {
            li.style.background = '#ffaaaa';
        }
    });
    if (selected === correct) {
        score++;
        resultEl.textContent = 'Correct!';
    } else {
        resultEl.textContent = `Wrong! Correct answer: ${correct}`;
    }
    nextBtn.style.display = 'inline-block';
}

function showResult() {
    questionEl.textContent = 'Quiz Finished!';
    choicesEl.innerHTML = '';
    resultEl.textContent = `Score: ${score} / ${quizSubset.length}`;
    saveScore();
    showLeaderboard();
    nextBtn.style.display = 'none';
}

function saveScore() {
    playerName = playerNameInput.value || 'Anonymous';
    let scores = JSON.parse(localStorage.getItem('chem_leaderboard') || '[]');
    scores.push({ name: playerName, score });
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('chem_leaderboard', JSON.stringify(scores));
}

function showLeaderboard() {
    let scores = JSON.parse(localStorage.getItem('chem_leaderboard') || '[]');
    leaderboardEl.innerHTML = '<h3>Leaderboard</h3>' +
        '<ol>' + scores.map(s => `<li>${s.name}: ${s.score}</li>`).join('') + '</ol>';
}


startBtn.onclick = async () => {
    await loadQuiz();
    currentQuestion = 0;
    score = 0;
    showQuestion();
};

nextBtn.onclick = () => {
    currentQuestion++;
    showQuestion();
};

const clearStorageBtn = document.getElementById('clear-storage-btn');
if (clearStorageBtn) {
    clearStorageBtn.onclick = () => {
        localStorage.clear();
        showLeaderboard();
        alert('Leaderboard and local storage cleared!');
    };
}
