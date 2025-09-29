const guessBtn = document.getElementById('guessBtn');
const guessInput = document.getElementById('guessInput');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const rangeText = document.getElementById('rangeText');

const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const modeBtns = [easyBtn, mediumBtn, hardBtn];

let min = 1;
let max = 100;
let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
let attempts = 0;
let prevGuesses = [];
let currentMode = 'medium';

const attemptsEl = document.getElementById('attempts');
const bestEl = document.getElementById('best');
const historyEl = document.getElementById('history');
const modeLabelEl = document.getElementById('modeLabel');

function getBest(mode) {
    const key = `number-game-best-${mode}`;
    const v = localStorage.getItem(key);
    return v ? Number(v) : null;
}

function setBest(mode, value) {
    const key = `number-game-best-${mode}`;
    localStorage.setItem(key, String(value));
}

function setMode(mode) {
    currentMode = mode;
    if (mode === 'easy') {
        min = 1; max = 50;
    } else if (mode === 'medium') {
        min = 1; max = 100;
    } else if (mode === 'hard') {
        min = 1; max = 500;
    }
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts = 0;
    prevGuesses = [];
    attemptsEl && (attemptsEl.textContent = '0');
    bestEl && (bestEl.textContent = getBest(mode) ?? '—');
    modeLabelEl && (modeLabelEl.textContent = mode[0].toUpperCase() + mode.slice(1));
    guessInput.min = min;
    guessInput.max = max;
    guessInput.value = '';
    message.textContent = '';
    historyEl && (historyEl.textContent = 'Previous: —');
    guessBtn.disabled = false;
    resetBtn.style.display = 'none';
    rangeText.textContent = `Guess a number between ${min} and ${max}:`;
    modeBtns.forEach(btn => btn.classList.remove('active'));
    if (mode === 'easy') easyBtn.classList.add('active');
    if (mode === 'medium') mediumBtn.classList.add('active');
    if (mode === 'hard') hardBtn.classList.add('active');
}

// Default mode
setMode('medium');

easyBtn.addEventListener('click', () => setMode('easy'));
mediumBtn.addEventListener('click', () => setMode('medium'));
hardBtn.addEventListener('click', () => setMode('hard'));

function handleGuess() {
    const userGuess = Number(guessInput.value);
    if (!userGuess || userGuess < min || userGuess > max) {
        message.textContent = `Please enter a valid number between ${min} and ${max}.`;
        return;
    }
    attempts++;
    attemptsEl && (attemptsEl.textContent = String(attempts));
    prevGuesses.push(userGuess);
    historyEl && (historyEl.textContent = `Previous: ${prevGuesses.join(', ')}`);
    if (userGuess === randomNumber) {
        message.textContent = `Correct! The number was ${randomNumber}.`;
        const best = getBest(currentMode);
        if (best === null || attempts < best) {
            setBest(currentMode, attempts);
            bestEl && (bestEl.textContent = String(attempts));
        }
        guessBtn.disabled = true;
        resetBtn.style.display = 'inline-block';
    } else if (userGuess < randomNumber) {
        const diff = randomNumber - userGuess;
        message.textContent = diff <= Math.max(3, Math.floor((max - min) * 0.02)) ? 'A little higher!' : 'Too low! Try again.';
    } else {
        const diff = userGuess - randomNumber;
        message.textContent = diff <= Math.max(3, Math.floor((max - min) * 0.02)) ? 'A little lower!' : 'Too high! Try again.';
    }
    // Clear the input after a valid guess
    guessInput.value = '';
    guessInput.focus();
}

guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGuess();
});

resetBtn.addEventListener('click', () => {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts = 0;
    prevGuesses = [];
    attemptsEl && (attemptsEl.textContent = '0');
    historyEl && (historyEl.textContent = 'Previous: —');
    guessBtn.disabled = false;
    guessInput.value = '';
    message.textContent = '';
    resetBtn.style.display = 'none';
    guessInput.focus();
});

// Initialize
setMode('medium');